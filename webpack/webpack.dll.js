const path = require('path');
const webpack = require('webpack');

const srcPath = path.resolve(__dirname, '../');

const library = [
	'react',
	'react-dom'
];

module.exports = {
	entry: {
		library: library
	},
	output: {
		path: path.resolve(srcPath, "build"),
		filename: "[name].dll.js",
		chunkFilename: "[name].[chunkhash].js",
		publicPath: 'http://localhost:8080/',
		library: "[name]"
	},
	plugins: [
		new webpack.DllPlugin({
			context: srcPath, //context of requests in the manifest file, defaults to the webpack context
			path: path.resolve(srcPath, "build", "[name]-manifest.json"),
			name: "[name]"
		})
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// })
	]
}