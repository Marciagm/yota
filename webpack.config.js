var webpack = require('webpack');

module.exports = {
    // 页面入口文件配置
    entry : {
        'addcarinfo': ['whatwg-fetch', './js/addcarinfo.js'],
        'myvehicle': ['whatwg-fetch', './js/myvehicle.js'],
        'records': ['whatwg-fetch', './js/records.js'],
        'license': ['whatwg-fetch', './js/license.js'],
        'addlicense': ['whatwg-fetch', './js/addlicense.js'],
        'trend': ['whatwg-fetch', './js/trend'],
        'trenddetail': ['whatwg-fetch', './js/trenddetail']
    },
    // 入口文件输出配置
    output : {
        path : __dirname + '/public/static/js/',
        filename : '[name].bundle.js'
    },
    module: {
        // 加载器配置
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader!jsx-loader?harmony'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            { 
                test: /\.json$/, 
                loader: "json-loader"
            }
        ]        
    },
    // 其他解决方案配置
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.json'],
    },
    // 插件项
    plugins : [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        // 用来清楚浏览器中控制台报错
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
}