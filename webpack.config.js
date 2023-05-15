const webpack = require('webpack');
const { basename, dirname, resolve } = require('path');
const browserslist = require('browserslist');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const fs = require('fs');

module.exports = (env) => {
	const isProduction = env.NODE_ENV === 'production';
	const mode = isProduction ? 'production' : 'development';
	const fromConfigRoot = (fileName) =>
		path.join(path.dirname(__dirname), 'config', fileName);

	let target = 'browserslist';
	if (!browserslist.findConfig('.')) {
		target += ':' + fromConfigRoot('.browserslistrc');
	}

	// App directory
	const appDirectory = fs.realpathSync(process.cwd());

	// Gets absolute path of file within app directory
	const resolveAppPath = (relativePath) =>
		path.resolve(appDirectory, relativePath);

	const host = process.env.HOST || 'localhost';

	return {
		mode,
		target: target,
		entry: {
			bundle: './src/bundle.js',
			main: './src/main.js',
			functionality: './src/functionality.js',
			advertising: './src/advertising.js',
			analytics: './src/analytics.js',
		},
		output: {
			filename: '[name].js',
			path: resolve(process.cwd(), 'dist'),
		},
		resolve: {
			alias: {
				'lodash-es': 'lodash',
				Utils: path.resolve(__dirname, 'src/utils'),
			},
			extensions: ['.jsx', '.ts', '.tsx', '...'],
		},
		optimization: {
			// Only concatenate modules in production, when not analyzing bundles.
			concatenateModules: isProduction,
			minimize: isProduction,
			minimizer: [
				new TerserPlugin({
					parallel: true,
					terserOptions: {
						output: {
							comments: /translators:/i,
						},
						compress: {
							passes: 3,
						},
					},
					extractComments: false,
				}),
			],
		},
		module: {
			rules: [
				{
					test: /\.(j|t)sx?$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: require.resolve('babel-loader'),
						options: {
							babelrc: true,
							configFile: true,
							presets: [
								[
									'@babel/preset-env',
									{
										debug: true,
										useBuiltIns: 'usage',
										corejs: require('core-js/package.json')
											.version,
									},
								],
							],
						},
					},
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				__COMMIT_HASH__: JSON.stringify(
					require('child_process')
						.execSync('git rev-parse --short HEAD')
						.toString()
						.trim()
				),
			}),
			new CleanWebpackPlugin({
				cleanAfterEveryBuildPatterns: ['!fonts/**', '!images/**'],
				// Prevent it from deleting webpack assets during builds that have
				// multiple configurations returned in the webpack config.
				cleanStaleWebpackAssets: false,
			}),
		],
		devServer: {
			// Serve index.html as the base
			static: resolveAppPath('./'),

			// Enable compression
			compress: false,

			// Enable hot reloading
			hot: true,

			host,

			port: 3000,
		},
	};
};
