const path = require('path');
const webpack = require('webpack');

const srcPath = path.resolve(__dirname, '../');
const DEBUG = process.env.NODE_ENV === 'production' ? true : false; //set NODE_ENV=production&&webpack --watch  &&一定要紧挨着....

module.exports = {
	entry: {
		app: ['./src/app.js']
	},
	output: {
		path: path.resolve(__dirname, "build"),
		filename: DEBUG ? "[name].js" : "[name].[hash].min.js" ,
		chunkFilename: "[name].js?[hash]-[chunkhash]",
		publicPath: '/assets'
	},
	module: {
		loaders:[
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			PRODUCTION: JSON.stringify(process.env.NODE_ENV)
		})
	],
	// 注意：你启动webpack-dev-server后，
	// 你在目标文件夹中是看不到编译后的文件的,实时编译后的文件都保存到了内存当中。
	// 因此很多同学使用webpack-dev-server进行开发的时候都看不到编译后的文件
	// 如果出现Uncaught Error: [HMR] Hot Module Replacement is disabled.记得在plugins加上new webpack.HotModuleReplacementPlugin()
	devServer: {
		port: 8080,
		contentBase: './build', //定义静态服务器的根路径，要把index.html放入编译后的目录下，即./build 
		hot: true,
		inline: true,
		quiet: true,
		historyApiFallback: true, 
		publicPath: "", 
		stats: { colors: true }
	}
}