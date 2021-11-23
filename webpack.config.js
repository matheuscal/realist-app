const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: "./main.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js"
    },
    devServer: {
      open: true,
      hot: true,
      historyApiFallback: true  
    },
    module: {
        rules: [
            {test: /\.jsx?$/i,
            loader: "babel-loader",
            exclude: /node_modules/
        },
        {
            test: /\.s?[ca]ss$/i,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            exclude: /node_modules/
        }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './index.html'})
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
}
