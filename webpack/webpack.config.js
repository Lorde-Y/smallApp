const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const srcPath = path.resolve(__dirname, '../');
const DEBUG = process.env.NODE_ENV === 'development' ? true : false; //set NODE_ENV=production&&webpack --watch  &&一定要紧挨着....
// const DEBUG = process.env.NODE_ENV === 'development' ? true : false; //set NODE_ENV=production&&webpack --watch  &&一定要紧挨着....

// http://caniuse.com/  可以查询在中国使用的浏览器类型及版本
const BROWSER_AUTOPREFIXER = [
	"Android >= 4",
	"and_chr >= 51", 
	"Chrome >= 20",
	"bb >= 8", 
	"Opera >= 20",
	"Edge >= 6", 
	"firefox >= 20",
	"Explorer >= 9", 
	"ie_mob >= 10", 
	"ios_saf > 8", 
	"safari >= 6",
	"and_uc >= 5",
	"Samsung >= 4"
];

module.exports = {
	devtoole: 'cheap-source-map',
	entry: {
		app: ['babel-polyfill','../src/app.js']
	},
	output: {
		path: path.resolve(srcPath, "build"),
		filename: DEBUG ? "[name].js" : "[name].[hash].min.js" ,
		chunkFilename: "[name].js?[hash]-[chunkhash]",
		publicPath: '/assets'
	},
	cache: !DEBUG,
	module: {
		loaders:[
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.js$/,
				loader: 'babel',
				include: [
					path.resolve(srcPath, "src")
				],
				exclude: [
					path.resolve(srcPath, "node_modules")
				],
				query: {
					presets: ['es2015', 'react','stage-0']
				}
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader'])
			}
		]
	},
	postcss: function(webpack) {
		return [
			// 这里再说一个问题，有些童鞋可能会在css文件中使用@import引入其他样式文件，
			// 但是使用autoprefixer发现，import进来的样式没有处理,postcss-import解决这个问题 https://github.com/zhengweikeng/blog/issues/9
			require('postcss-import')({ 
				addDependencyTo: webpack
			}),
			require('autoprefixer')({
				browsers: BROWSER_AUTOPREFIXER
			})
		]
	},
	resolve: {
		root: srcPath,
		modulesDirectories: ["node_modules"],
		extension: ['.js', '.jsx', 'json'],
		alias: {
			"common": path.resolve(srcPath, 'src/common'),
			"components": path.resolve(srcPath, 'src/components'),
			"utils": path.resolve(srcPath, 'src/utils'),
			"action": path.resolve(srcPath, 'src/action'),
			"reducer": path.resolve(srcPath, 'src/reducer')
		}
	},
	plugins: [
		new htmlWebpackPlugin({
			title: 'show small app',
			filename: 'index.html',
			template: path.resolve(srcPath, 'src/html/mobile.html'),
			hash: !DEBUG,
			cache: !DEBUG,
			showErrors: true,
			minify: DEBUG ? false : {
				removeComments: true,
				collapseWhitespace: true,
				removeTagWhitespace: true
			}
		}),
		new ExtractTextPlugin( ( DEBUG ? "[name].css" : "[name].[hash].min.css" )),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			PRODUCTION: JSON.stringify(process.env.NODE_ENV)
		}),
		new webpack.DllReferencePlugin({
			context: srcPath,
			manifest: require('../build/library-manifest.json')
		}),
		new webpack.ProvidePlugin({   //set global scope
			React: 'react'
		})
		// DEBUG ? '' : new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// })
	],

	devServer: {
		port: 7070,
		contentBase: '../build', //定义静态服务器的基路径 
		hot: true,
		inline: true,
		historyApiFallback: true, 
		publicPath: "", 
		stats: { colors: true }
	}
}