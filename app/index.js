import 'babel-polyfill';
import 'styles.css';
import {sobel} from 'scripts/filters';
// import imgSrc from 'images/galaxy.jpg';
// import imgSrc from 'images/kaylo.jpg';
// import imgSrc from 'images/photo.jpg';
import imgSrc from 'images/0f80c848822253.58b8002062615.jpg';
// import imgSrc from 'images/photo.jpg';

// const W = 1920, H = 1080;
// const W = 1600, H = 900;
// const W = 960, H = 540;
// const W = 480, H = 270;
const W = 240, H = 145;


const img = new Image();
img.onload = () => {
    const W = img.width, H = img.height;


    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.style.boxSizing = `content-box`;
    sourceCanvas.style.border = '1px solid';
    sourceCanvas.style.width = `$45vw`;
    sourceCanvas.style.height = `${H / W * 45}vw`;
    sourceCanvas.width = W;
    sourceCanvas.height = H;

    const drawCanvas = document.createElement('canvas');
    drawCanvas.style.boxSizing = `content-box`;
    drawCanvas.style.border = '1px solid';
    drawCanvas.style.width = `$45vw`;
    drawCanvas.style.height = `${H / W * 45}vw`;
    drawCanvas.width = W;
    drawCanvas.height = H;
    document.body.appendChild(drawCanvas);
    document.body.appendChild(sourceCanvas);


    sourceCanvas.getContext('2d').drawImage(img, 0, 0, W, H);
    sobel(sourceCanvas, drawCanvas);
};
img.src = imgSrc;

