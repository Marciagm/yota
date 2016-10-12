'use strict'
var yota = require('./config');
var dateForm = require('./dateForm');
var React = require('react');
var ReactDOM = require('react-dom');

var myVehicle = {

    /*
    * 获取车辆信息
    */
    getVehicleInfo: function () {
        var base = this;
        yota.tokenValue().then(function (token) {
            yota.request(yota.myVehicle, 'GET', token).then(base.dealInformation.bind(base));
        })
    },

    /**
     * 车辆信息控件
     */
    VehicleInfoPart: React.createClass({
        // 获取最原始状态
        getInitialState: function() {
            return {data: this.props.data};
        },
        // 刷新事件
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

        // 编辑事件
        editHandleClick: function (event) {
            var base = this;
            var token = yota.tokenValue();
            // 将修改地址存储在本地cookie中
            yota.setCookie(yota.carInfoEdit, base.props.data.edit_uri);
            window.open('./addcarinfo.html?edit');
        },
        
        // 检查详情
        checkDetail: function (event) {
            //window.open('records');
            var target = event.target;
            yota.setCookie(yota.recordsInfo, this.props.data.peccancy_uri);
            window.open('./records.html?name=' + encodeURIComponent($(target).data('name')));
        },

        render: function () {
            var data = this.state.data;
            var dateTime = data.update_datetime
                           ? data.update_datetime.substring(0,10)
                           : '';
                           //: dateForm.toYMD('', 'yyyy-mm-dd');
            var verified = '尚未验证';
            var verifiedClass = 'fail';
            var veriType = 0;
            if (data.verified && data.active) {
                verified = '验证通过';
                verifiedClass = 'adopt';
                veriType = 1;
            }
            else if (data.verified && !data.active) {
                verified = '验证未通过';
                verifiedClass = 'fail';
            }
            else if (!data.verified && !data.active) {
                verified = '尚未验证';
                verifiedClass = 'fail';
            }
            if (veriType) {
                return (<li className="border_bottom">
                        <div className="mycar_number">
                            <label onClick={this.editHandleClick}>{data.display_name}</label>
                            <a></a>
                        </div>
                        <div className="mycar_state">
                            <label>更新状态：{dateTime}</label>
                            <label>验证状态：<span className={verifiedClass}>{verified}</span></label>
                            <a className="" onClick={this.refreshHandleClick}>
                                <img className ='update' data-name={data.display_name} id={data.id}  src='/images/update.png' />
                            </a>
                        </div>
                        <div className="traffic_violation">
                            <label>未处理违章：
                                <span className="red">{data.undeal}条</span>
                            </label>
                            <label>未缴款违章：
                                <span className="red">{data.unpenalty}条</span>
                            </label>
                            <img src='/images/arrow-right.png' data-name={data.display_name} className="arrow-right" onClick={this.checkDetail}/>
                        </div>

                    </li>
                )
            }
            else {
                return (<li className="border_bottom">
                        <div className="mycar_number">
                            <label onClick={this.editHandleClick}>{data.display_name}</label>
                            <a></a>
                        </div>
                        <div className="mycar_state">
                            <label>更新状态：{dateTime}</label>
                            <label>验证状态：<span className={verifiedClass}>{verified}</span></label>
                            <a className="" onClick={this.refreshHandleClick}>
                                <img className ='update' id={data.id}  src='/images/update.png' />
                            </a>
                        </div>
                        <div className="traffic_tips">
                            请点击车牌编辑，重新核对车辆信息填写是否正确
                        </div>
                    </li>
                )
            }
            
        }
    }),

    /**
     * 处理数据
     */
    dealInformation: function (data) {
        var VehicleInfoPart = this.VehicleInfoPart;

        ReactDOM.render(
            <ul className="ul_style">
                {
                    data.map(function (obj, index) {
                        return <VehicleInfoPart data={obj}/>
                    })
                }
            </ul>,
            document.getElementById('js_vehicles')
        )
    },

    // 入口文件
    init: function () {
        yota.pageScroll();
        this.getVehicleInfo();
        // 点击添加按钮事件
        $('#js_addcar').click(function (event) {
            window.open('./addcarinfo.html?clear');
        })
    }
};

// 开始运行
myVehicle.init();