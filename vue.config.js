const path = require('path')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const HyperDown = require('hyperdown')

const parser = new HyperDown()

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '',
  outputDir: 'upmsUI',
  lintOnSave: true,
  devServer: {
    port: '8888',
    proxy: {
      '': {
        // target: 'http://17.16.8.96:8890/',
        target: 'http://17.16.39.115:8891/',
        changeOrigin: true
        // pathRewrite: { '^/': '' },
      }
    }
  },

  chainWebpack: (config) => {
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        // markdown-it config
        preset: 'default',
        breaks: true,
        raw: true,
        typographer: true,
        preprocess(markdownIt, source) {
          return parser.makeHtml(source)// 重点在这里！！！
        }
      })
  },
  configureWebpack: (config) => {
    config.devtool = 'source-map'
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new FileManagerPlugin({
          onEnd: {
            delete: ['./upmsUI.zip'],
            archive: [{ source: './upmsUI', destination: './upmsUI.zip' }]
          }
        })
      )
    }
  }
}
