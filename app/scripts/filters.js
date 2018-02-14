const pixelsPerTick = 5000;

export async function sobel(source, result = source) {
    const buffer = document.createElement('canvas');
    buffer.width = source.width;
    buffer.height = source.height;

    console.log('Calculating of image intense');
    const intense = await getIntense(source);

    console.log('Drawing grayscale image');
    await fillBuffer(buffer, getGrayScalePixelColors(intense));
    result.getContext('2d').drawImage(buffer, 0, 0);

    console.log('Calculating of image gradients');
    const gradients = await getGradients(intense);
    console.log(gradients);

    await delay(500);
    console.log('Drawing gradient image');
    await fillBuffer(buffer, await  getOriginalPixelColors(gradients, source));
    result.getContext('2d').drawImage(buffer, 0, 0);
}

function getIntense(source) {
    const sourceCtx = source.getContext('2d');
    const intense = [];

    function getNextIntense(i, j) {
        if (!intense[i]) intense[i] = [];
        const pixel = sourceCtx.getImageData(i, j, 1, 1);
        intense[i][j] = getRgbIntense(pixel.data[0], pixel.data[1], pixel.data[2]);
    }

    return performMatrixOperations(getNextIntense, source.width, source.height)
        .then(() => intense);
}

function getGradients(intense) {
    const iMax = intense.length, jMax = intense[0] ? intense[0].length : 0;
    const gradients = [];
    let maxGrad = 0;

    function getGradient(i, j) {
        if (!gradients[i]) gradients[i] = [];
        const yGrad = -1 * getIntense(i - 1, j - 1) - 2 * getIntense(i - 1, j) - 1 * getIntense(i - 1, j + 1)
            + getIntense(i + 1, j - 1) + 2 * getIntense(i + 1, j) + getIntense(i + 1, j + 1);
        const xGrad = -1 * getIntense(i - 1, j - 1) - 2 * getIntense(i, j - 1) - 1 * getIntense(i + 1, j - 1)
            + getIntense(i - 1, j + 1) + 2 * getIntense(i, j + 1) + getIntense(i + 1, j + 1);

        const grad = Math.sqrt(yGrad * yGrad + xGrad * xGrad);
        gradients[i][j] = grad;
        if (maxGrad < grad) maxGrad = grad;
    }
    function getIntense(i, j) {
        if (i < 0 || i >= iMax || j < 0 || j >= jMax) return 0;
        return intense[i][j];
    }

    return performMatrixOperations(getGradient, iMax, jMax)
        .then(() => {
            for (let i = 0; i < iMax; i++) {
                for (let j = 0; j < jMax; j++) {
                    gradients[i][j] = gradients[i][j] / maxGrad;
                    gradients[i][j] = gradients[i][j] > 0.7 ? 0.7 : gradients[i][j];

                    // gradients[i][j] = gradients[i][j] / maxGrad * 2.2;
                    // gradients[i][j] = gradients[i][j] > 0.8 ? 0.8 : gradients[i][j];

                    // gradients[i][j] = gradients[i][j] / maxGrad * 2.2;
                    // gradients[i][j] = gradients[i][j] > 0.8 ? 0.8 : gradients[i][j];
                    // gradients[i][j] = gradients[i][j] > 0.35 && gradients[i][j] < 0.4 ? 0.4 : gradients[i][j];

                    gradients[i][j] *= 255;
                }
            }
            return gradients;
        });
}

function fillBuffer(buffer, pixelRgbColors) {
    const iMax = pixelRgbColors.length, jMax = pixelRgbColors[0] ? pixelRgbColors[0].length : 0;
    const bufferCtx = buffer.getContext('2d');

    function fillPixel(i, j) {
        bufferCtx.fillStyle = `rgb(${pixelRgbColors[i][j][0]},${pixelRgbColors[i][j][1]},${pixelRgbColors[i][j][2]})`;
        bufferCtx.fillRect(i, j, 1, 1);
    }

    return performMatrixOperations(fillPixel, iMax, jMax);
}

function performMatrixOperations(operation, iMax, jMax) {
    return new Promise(resolve => {
        let i = 0, j = 0;

        const intervalId = setInterval(() => {
            for (let c = 0; c < pixelsPerTick; c++) {
                operation(i, j);

                i++;
                if (i >= iMax) {
                    i = 0;
                    j++;
                    if (j >= jMax) {
                        clearInterval(intervalId);
                        console.log(100);
                        return resolve();
                    }
                }
            }
            logPerformCompletePercent();
        });


        function logPerformCompletePercent() {
            const percent = +((iMax * j + i) * 100 / (iMax * jMax)).toFixed(4);
            console.log(percent);
        }
    });
}

function getOriginalPixelColors(matrix, sourceCanvas) {
    const iMax = sourceCanvas.width, jMax = sourceCanvas.height;
    const sourceCtx = sourceCanvas.getContext('2d');
    const colors = [];

    function getPixelColor(i, j) {
        if (!colors[i]) colors[i] = [];
        const pixel = sourceCtx.getImageData(i, j, 1, 1);
        const pixelIntense = getRgbIntense(pixel.data[0], pixel.data[1], pixel.data[2]),
            newIntense = matrix[i][j];
        const newColor = mulColor(pixel.data[0], pixel.data[1], pixel.data[2], newIntense / pixelIntense);
        colors[i][j] = newColor;
    }

    return performMatrixOperations(getPixelColor, iMax, jMax)
        .then(() => colors);
}

function getGrayScalePixelColors(matrix) {
    const colors = [];
    for (let i = 0; i < matrix.length; i++) {
        colors[i] = [];
        for (let j = 0; j < matrix[i].length; j++) {
            const gray = Math.min(255, Math.round(matrix[i][j]));
            colors[i][j] = [gray, gray, gray];
        }
    }
    return colors;
}

function getRgbIntense(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function mulColor(r, g, b, multiplier) {
    const newR = Math.min(255, Math.round(r * multiplier));
    const newG = Math.min(255, Math.round(g * multiplier));
    const newB = Math.min(255, Math.round(b * multiplier));
    return [newR, newG, newB];
}

function delay(time) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), time);
    });
}
