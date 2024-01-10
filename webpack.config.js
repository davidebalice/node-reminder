const path = require('path');

module.exports = {
  mode: 'production', // development', 'production', 'none'
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.node$/,
        loader: 'ignore-loader', // Un loader fittizio che ignora i file corrispondenti al test
      },
    ],
  },
};
