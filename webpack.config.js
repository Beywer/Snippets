const path = require('path');

module.exports = {
    entry: "./app/index.js",

    output: {
        path: path.resolve(__dirname, "dist"), // string
        filename: "bundle.js", // string
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, "app")],
                exclude: [path.resolve(__dirname, "node_modules")],

                loader: "babel-loader",

                options: {
                    presets: ["env"]
                },
            },
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            },
        ],
    },

    resolve: {

        modules: [
            "node_modules",
            path.resolve(__dirname, "app")
        ],

        extensions: [".js", ".json", ".jsx", ".css"],
        alias: {},
    },

    performance: {},

    devtool: "source-map",

    context: __dirname,

    target: "web",

    devServer: {
        contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload
    },

    plugins: [],
};
