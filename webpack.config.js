// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production', // Use 'development' for easier debugging, 'production' for deployment
  entry: {
    // Entry point for background script (service worker)
    background: './background/sw.js',
    // Entry points for content scripts
    linkedin: './content/linkedin.js',
    indeed: './content/indeed.js',
    // Entry point for popup script
    popup: './popup/popup.js'
  },
  output: {
    // Output bundled files to the 'dist' directory
    filename: '[name].bundle.js', // [name] will be replaced by entry point keys (background, linkedin, etc.)
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the dist folder before each build
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply Babel loader to all .js files
        exclude: /node_modules/, // Don't transpile node_modules
        use: {
          loader: 'babel-loader', // Use Babel to transpile modern JavaScript
          options: {
            presets: ['@babel/preset-env'] // Use preset-env for broad compatibility
          }
        }
      }
    ]
  },
  // Optional: Configure devtool for source maps (helps debugging)
  // Use 'inline-source-map' for development, 'source-map' or none for production
  devtool: 'cheap-module-source-map', // Good balance for development
  // Optional: Configure performance hints (warnings about large bundle sizes)
  performance: {
    hints: 'warning', // Show warnings for large files
  },
   // Optional: Resolve extension-less imports if needed (usually not required with explicit .js)
   resolve: {
       extensions: ['.js'],
   },
};