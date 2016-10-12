'use strict' 
var fetch = require('node-fetch');

var yota = {
    version: 1.0,
    // 域名
    apiHost: 'http://auto.yotadb.com:80/api/v1.0/',

    //车牌号
    plateAlias: 'base/plate_alias',
    
    // 车辆类型
    vehicleType: 'base/vehicle_type',

    // 提交添加车辆信息
    addCarInfo: 'vehicle/entries',

    // 获取token
    token: 'token?code=2016',

    // 我的车辆
    myVehicle: 'vehicle/mixtures',

    // 车辆违章
    peccancies: 'vehicle/peccancies/1',

    // 我的驾驶证
    license: 'license/mixtures',

    // 地区信息
    region: 'base/region',

    // 添加驾驶证信息
    addLicense: 'license/entries',

    // 按月份获取
    monthDetail: 'license/demerit/month/',

    // 本地cookie名称
    carInfoEdit: 'carInfoEdit',

    licenseInfoEdit: 'licenseInfoEdit',

    historyInfo: 'historyInfo',

    historyDetail: 'historyDetail',

    month: 'monthInfo',

    recordsInfo: 'recordsInfo',
    /**
     * 通过fetch进行网络请求
     * 
     * @param {string} url 请求地址：当前路径
     * @param {string} method 请求方法，默认为'GET'
     * @return {object} object 返回为promise对象
     */
    request: function (url, method, token, data) {
        method = method || 'GET';
        url = url && url.indexOf('http') > -1 ? url : this.apiHost + url;
        url = url.replace('auto.yotadb.com/', 'auto.yotadb.com:80/');
        token = 'token ' + token;

        return fetch(url,  {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": token
            },
            body: JSON.stringify(data)
        }).then(function (res) {
            return res.text();
        }).then(function (body) {
            try {
                if (body) {
                    body = JSON.parse(body);
                }
            }
            catch (e) {
                return body;
            }
            return body;
        }, function (reason) {
            //alert('body:' + reason);
        })
    },
    
    /**
     * 直接返回res的请求
     */
    requestWithStatus: function (url, method, token, data) {
        method = method || 'GET';
        url = url && url.indexOf('http') > -1 ? url : this.apiHost + url;
        url = url.replace('auto.yotadb.com/', 'auto.yotadb.com:80/');
        token = 'token ' + token;
        return fetch(url,  {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": token
            },
            body: JSON.stringify(data)
        })
       
    },

    /**
     * 获取token
     */
    getToken: function () {
        var base = this;
        return fetch(this.apiHost + this.token,  {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            }
        }).then(function (res) {
            return res.text();
        }).then(function (body) {
            return JSON.parse(body);
        })
    },

    /**
     * 返回token值
     */
    tokenValue: function () {
        var base = this;
        var tokenTime = this.getCookie('tokenTime');
        var token = '';
        var nowTime = new Date().getTime();
        if (tokenTime && (nowTime - tokenTime) < 30 * 1000 * 60) {
            token = this.getCookie('token');
        }
        if (!token || token + '' === 'undefined') {
            return this.getToken().then(function (body) {
                base.setCookie('token', body.token);
                base.setCookie('tokenTime', new Date().getTime());
                token = body.token;
                return token;
            })
        }
        else {
            return {
                then: function (func) {
                    func(token);
                }
            }
        }
    },

    /**
     * 设置cookie
     * 
     * @param {string} key 
     * @param {string} value
     * @param {string} expiredays 有效分钟
     */
    setCookie: function (key, value, expire, path) {
        path = path || '/';
        document.cookie =  key + '=' + encodeURIComponent(value);
    },
    

    /**
     * 取cookie值
     */
    getCookie: function (key) {
        var cookies = document.cookie;
        if (cookies.length < 0) {
            return '';
        }
        cookies = cookies.split(';');
        for (var i = 0, len = cookies.length; i < len; i++) {
            var cookie = cookies[i];
            if (cookie) {
                var items = cookie.replace(/\s*/, '').split('=');
                if (key == items[0]) {
                    return decodeURIComponent(items[1]);
                }
            }
            
        }
        return '';
    },

    /**
     * 获取参数
     */
    getSearchParam: function () {
        var search = location.search;
        if (search) {
            search = search.replace('?', '');
            return search;    
        }
        return '';
    },

    /**
     * 车牌号检验
     */
    carNumRegExect: function (value) {
        var reg = new RegExp('^[0-9A-Za-z]{6}$');
        if (value.indexOf('警') === 5) {
            reg = new RegExp('^[0-9A-Za-z]{5}警$');
        }
        
        return reg.test(value);
    },

    /**
     * 发动机号码检验
     */
    engineNoRegExect: function (value) {
        var reg = new RegExp('^[0-9A-Za-z]{6}$');
        return reg.test(value);
    },
    
    /**
     * 驾驶证号码检验
     */
    licenseNoExec: function (value) {
        var reg = new RegExp('^[0-9A-Za-z]+$');
        return reg.test(value);
    },

    /**
     * 档案编号检验
     */
    fileNoExec: function (value) {
        var reg = new RegExp('^[0-9]+$');
        return reg.test(value);
    },

    /**
     * 页面滚动事件
     *
     * @param {function} callback 分页的回调函数
     */
    pageScroll: function (callback) {
        /*var base = this;
        // 开始滑动
        document.addEventListener('touchstart', function (event) {
            base.startY = event.touches[0].screenY;
        }, false); 

        // 结束滑动 
        document.addEventListener('touchend', function (event) {
            base.endY = event.changedTouches[0].screenY;
        }, false);   
 
        // 上滑加载新的分页
        $(window).scroll(function(event) {
        　　var scrollTop = $(this).scrollTop();
        　　var scrollHeight = $(document).height();
        　　var windowHeight = $(this).height();
            var now = (+new Date());
            // reload
            if ((base.endY - base.startY) >= 10 && document.body.scrollTop <= 0) {
                base.refresh();
            }
        });*/
    },

    //上拉刷新
    refresh: function () {
        window.location.reload();
    },

    /**
     * 获取token 
     */
    wxConfig: function () {
        
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: '', // 必填，公众号的唯一标识
            timestamp: '', // 必填，生成签名的时间戳
            nonceStr: '', // 必填，生成签名的随机串
            signature: '',// 必填，签名，见附录1
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'onVoicePlayEnd',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
    }
}

module.exports = yota;