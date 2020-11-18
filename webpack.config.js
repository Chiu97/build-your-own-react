const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    target: 'web',
    mode: 'development',
    entry: './src/index.js',
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader'
                }
            },
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './template.html'
    })],
    devServer: {
        port: 11001
    }
}