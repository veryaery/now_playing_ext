const path = require("path");

module.exports = {
	entry: path.resolve(__dirname, "src/index.ts"),
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			}
		]
	},
	resolve: {
		extensions: [ ".js", ".ts" ]
	},
	output: {
		filename: "build.js",
		path: path.resolve(__dirname, "build"),
	},
	devtool: "source-map"
};