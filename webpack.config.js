const webpack = require('webpack');
const { ModuleFederationPlugin } = require('webpack').container;
const { basename, dirname, resolve } = require('path');
const browserslist = require('browserslist');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const postCSSPlugins = require('@wordpress/postcss-plugins-preset');
const jsonInSassImporter = require('node-sass-json-importer');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

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

	const cssLoaders = [
		/*
		{
			loader: MiniCSSExtractPlugin.loader,
		},
		*/
		{
			loader: require.resolve('style-loader'),
			options: {
				injectType: 'lazyAutoStyleTag',
				insert: function insertIntoTarget(element, options) {
					var parent = options.target || document.head;
					parent.appendChild(element);
				},
			},
		},
		{
			loader: require.resolve('css-loader'),
			options: {
				sourceMap: !isProduction,
				modules: {
					auto: true,
				},
			},
		},
		{
			loader: require.resolve('postcss-loader'),
			options: {
				postcssOptions: {
					ident: 'postcss',
					sourceMap: !isProduction,
					plugins: isProduction
						? [
								...postCSSPlugins,
								require('cssnano')({
									preset: [
										'default',
										{
											discardComments: {
												removeAll: true,
											},
										},
									],
								}),
						  ]
						: postCSSPlugins,
				},
			},
		},
	];

	return {
		mode,
		target: target,
		entry: () => {
			const entries = {
				bundle: './src/bundle.js',
				main: './src/main.js',
				functionality: './src/functionality.js',
				advertising: './src/advertising.js',
				analytics: './src/analytics.js',
			};

			// const modules = glob
			// 	.sync('./src/*/modules/*/export*.js')
			// 	.reduce((pre, cur) => {
			// 		const key = cur
			// 			.replace(/\.\/src\/([^\/]+)\/modules/, '$1')
			// 			.replace(/\/export(-[^\.]+)?\.js/, '$1');
			// 		//.replace('/export.js', '');
			// 		pre[key] = cur;
			// 		return pre;
			// 	}, {});

			// console.log(modules);

			// return {
			// 	...entries,
			// 	...modules,
			// };
			return { ...entries };
		},
		output: {
			filename: '[name].js',
			chunkFilename: '[name].[chunkhash].js',
			path: resolve(process.cwd(), 'dist'),
			chunkLoadingGlobal: 'cmlsAmpUtils',
		},
		resolve: {
			alias: {
				react: 'h',
				'react-dom': 'h',
				'react/jsx-runtime': 'h',
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
						compress: {
							passes: 5,
						},
					},
					extractComments: false,
				}),
			],
			//runtimeChunk: 'single',
			concatenateModules: true,
			splitChunks: {
				chunks: 'async',
				cacheGroups: {
					vendors: {
						name: 'vendors',
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						chunks: (chunk) =>
							![
								'main',
								'advertising',
								'analytics',
								'functionality',
							].includes(chunk.name),
						reuseExistingChunk: true,
					},
				},
			},
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
								'@babel/preset-react',
								[
									'@babel/preset-env',
									{
										loose: true,
										debug: true,
										useBuiltIns: 'usage',
										corejs: require('core-js/package.json')
											.version,
									},
								],
							],
							plugins: [
								['@babel/plugin-transform-runtime'],
								[
									'@babel/plugin-transform-react-jsx',
									{
										pragma: 'h',
										pragmaFrag: 'Fragment',
									},
								],
							],
						},
					},
				},
				{
					test: /\.css$/,
					use: cssLoaders,
				},
				{
					test: /\.(sc|sa)ss$/,
					use: [
						...cssLoaders,
						{
							loader: require.resolve('sass-loader'),
							options: {
								sourceMap: !isProduction,
								sassOptions: {
									importer: jsonInSassImporter(),
								},
							},
						},
					],
				},
			],
		},
		plugins: [
			new ModuleFederationPlugin({
				runtime: 'cmls-amp-utils',
				shared: ['core-js', 'lodash', 'style-loader', 'css-loader'],
			}),
			new CleanWebpackPlugin({
				cleanAfterEveryBuildPatterns: ['!fonts/**', '!images/**'],
				// Prevent it from deleting webpack assets during builds that have
				// multiple configurations returned in the webpack config.
				cleanStaleWebpackAssets: false,
			}),
			/*
			isProduction &&
				new MiniCSSExtractPlugin({
					filename: '[name].css',
					chunkFilename: (pathData) => {
						return '[name].[chunkhash].css';
					},
					insert: function (linkTag) {
						//console.log('WTF', arguments);
						return {
							default: {
								use: ({ target }) => {
									console.log('WTF', target);
								},
							},
						};
					},
				}),
			*/
		],
		devServer: {
			// Serve index.html as the base
			static: resolveAppPath('./'),

			// Enable compression
			compress: true,

			// Enable hot reloading
			hot: false,

			host,

			port: 3000,

			allowedHosts: 'all',

			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods':
					'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers':
					'X-Requested-With, content-type, Authorization',
			},
		},
	};
};
