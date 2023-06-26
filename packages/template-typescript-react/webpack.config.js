const path = require('path')
const fs = require('fs')

const publicDir = './public'
const htmlFileName = 'index.html'
const targetDir = './dist'

// check if public dir exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir)
}

// copy html file to dist
fs.writeFileSync(
  path.join(__dirname, targetDir, htmlFileName),
  fs.readFileSync(path.join(__dirname, publicDir, htmlFileName)),
  'utf8',
  {
    flag: 'w+'
  }
)

// typescript config
// https://webpack.js.org/guides/typescript/
module.exports = {
  entry: './src/dev.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, targetDir)
  }
}
