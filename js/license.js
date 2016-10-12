'use strict'
var yota = require('./config');
var React = require('react');
var ReactDOM = require('react-dom');

var license = {
    // 获取驾驶证信息
    getLicense: function () {
        var base = this;
        yota.tokenValue().then(function (token) {
            yota.request(yota.license, 'GET', token).then(base.dealInformation.bind(base));
        })
    },

    // 控件
    LicensePart: React.createClass({
        // 修改方法
        editHandleClick: function (event) {
            yota.setCookie(yota.licenseInfoEdit, this.props.data.edit_uri);
            location.href = './addlicense.html?edit'; 
        },

        // 查看历史趋势
        checkHistoryInfo: function (event) {
            yota.setCookie(yota.historyInfo, this.props.data.demerit_uri);
            var id = this.props.data.demerit_uri.split('/')[this.props.data.demerit_uri.split('/').length - 1];
            location.href = '../history/trend.html?id=' + id + '&test=test45';
        },

        // 刷新
        refreshHandleClick: function (event) {
            var refreshUri = this.props.data.uri;
            var base = this;
            var target = event.target;
            $(target).removeClass('refresh');
            yota.tokenValue().then(function (token) {
                yota.request(refreshUri, 'GET', token).then(function (data) {
                    base.setState({data: data});
                    $(target).addClass('refresh');
                    alert('已刷新');
                })
            })
        },

        render: function () {
            var verified = '验证失败';
            var verifiedClass = 'fail';
            var veriType = 0;
            var dateTime = this.props.data.update_time
                           ? this.props.data.update_time.substring(0,10)
                           : '';

            if (this.props.data.verified && this.props.data.active) {
                verified = '验证通过';
                verifiedClass = 'adopt';
                veriType = 1;
            }
            else if (this.props.data.verified && !this.props.data.active) {
                verified = '验证未通过';
            }
            else if (!this.props.data.verified && !this.props.data.active) {
                var verified = '尚未验证';
            }
            if (veriType) {
                return (<li className="border_bottom">
                    <div className="driverLicense_number">
                        <label onClick={this.editHandleClick}>{this.props.data.display_name}</label><a></a>
                    </div>
                    <div className="driverLicense_state">
                        <label>更新时间：{dateTime}</label>
                        <label>验证状态：
                            <span className={verifiedClass}>{verified}</span>
                        </label>
                        <a className="" onClick={this.refreshHandleClick}>
                            <img className ='update' data-name={this.props.data.display_name} id={this.props.data.id}  src='/images/update.png' />
                        </a>
                    </div>
                    <div className="traffic_violation">
                        <label>当前扣分：
                            <span className="red">{this.props.data.score}分</span>
                        </label>
                        <a className="caret_right" onClick={this.checkHistoryInfo}>查看历史趋势</a>
                    </div>
                </li>)
            }
            else {
                return (<li className="border_bottom">
                    <div className="driverLicense_number">
                        <label onClick={this.editHandleClick}>{this.props.data.display_name}</label><a></a>
                    </div>
                    <div className="driverLicense_state">
                        <label>更新时间：{dateTime}</label>
                        <label>验证状态：
                            <span className={verifiedClass}>{verified}</span>
                        </label>
                        <a className="" onClick={this.refreshHandleClick}>
                            <img className ='update' data-name={this.props.data.display_name} id={this.props.data.id}  src='/images/update.png' />
                        </a>
                    </div>
                    <div className="traffic_tips">
                        请点击车牌编辑，重新核对车辆信息填写是否正确
                    </div>
                </li>)
            }
            
        }
    }),

    /*
     * 处理返回的数据
     * 
     * @param {object} data 驾驶证数据
     */
    dealInformation: function (data) {
        var LicensePart = this.LicensePart;
        ReactDOM.render(
            <ul className="ul_style">
                {
                    data.map(function (obj, index) {
                        return <LicensePart data={obj}/>
                    })
                }
            </ul>,
            document.getElementById('js_list')
        )
    },


    // 入口
    init: function () {
        // 上拉刷新事件
        yota.pageScroll();
        // 点击添加按钮事件
        $('#js_addlicense').click(function (event) {
            //window.open('./addlicense');
            location.href = './addlicense.html?test123';
            //window.open('./addlicense.html?test123');
        })

        this.getLicense();
    }
};

// 开始执行
license.init();