'use strict'
var yota = require('./config');
var React = require('react');
var ReactDOM = require('react-dom');

var addCarInfo = {
    isFinished: false,
    dataFinished: false,
    plates: {},
    data: {},
    editUrl: '',
    // 嵌套控件
    Vehiclehild: React.createClass({
        handleClick: function (event) {
            $('#js_vehicles a').removeClass('select');
            $(event.target).addClass('select');
            $('#vehicles_kind_value').val($(event.target).text());
            $('#vehicles_kind_value').data('type', $(event.target).data('no'));
            if ($(event.target).data('no') === '03') {
                $('#vehicles_number_value').val('使');

                var domAlias = $('#js_plate a');

                for (var i = 0; i < domAlias.length; i++) {
                    var item = domAlias[i];
                    var val = $(item).text();
                    if (val.trim() === '使') {
                        $(item).siblings().removeClass('select');
                        $(item).addClass('select');
                        break;
                    }
                }
            }
            $('#js_vehicles').hide();
        },

        render: function () {
           var NOs = this.props.NOs;
           var handleClick = this.handleClick;
           return (<div>
               {
                    React.Children.map(this.props.types, function (type, index) {
                        // 默认为小型汽车
                        var className = NOs[index] === '02'
                        ? 'vehicles_kind_option select' : 'vehicles_kind_option ';
                        return <a className={className} data-no={NOs[index]} 
                        onClick={handleClick}>{type}</a>
                    })
                }
            </div>)
        }
    }),

    // 获取车辆类型
    loadVehiclesPart: function () {
        var base = this;
        var Vehiclehild = this.Vehiclehild;
        yota.tokenValue().then(function (token) {
            yota.request(yota.vehicleType, 'GET', token).then(function (data) {
                alert(data);
                ReactDOM.render(
                    <div>
                        {
                            data.map(function (obj, index) {
                                var types = [];
                                var NOs = [];
                                for (var i = 0, len = obj.types.length; i < len; i++) {
                                    types.push(obj.types[i].name);
                                    NOs.push(obj.types[i].no);
                                }
                                var className = index ? 'vehicles_kind_2' : 'vehicles_kind_1';
                                return (<div>
                                        <label className={className}>{obj.name}</label>
                                        <Vehiclehild types={types} NOs={NOs} />
                                    </div>
                                )        
                            })
                        }
                    </div>,
                    document.getElementById('js_vehicles')
                )
                base.isFinished = true;
                base.fillVehicleType();
            })    
        })
        
    },

    // plates控件
    PlatesPart: React.createClass({
        handleClick: function (event) {
            var current = event.target;
            // 样式
            $(current).siblings().removeClass('select');
            $(current).addClass('select');

            //选择车牌归属地事件
            $('#vehicles_number_value').val($(current).text());
            $('#vehicles_number_value').data('id', $(current).data('id'));
            $('#js_plate').hide();
            event.stopPropagation()
        },
        render: function () {
            var handleClick = this.handleClick;
            return  <div> 
                {
                    React.Children.map(this.props.plates, function (name, index) {
                        var classAttr = 'vehicles_number_option';
                        index ? '' : classAttr += ' select';
                        return <a className={classAttr} onClick={handleClick} data-id={index}> {name} </a>
                    })
                }
            </div>
        }
    }),

    // 获取车牌号归属地并将归属地添加到dom结构中
    loadPlatePart: function () {
        var base = this;
        var PlatesPart = this.PlatesPart;
        yota.tokenValue().then(function (token) {
            yota.request(yota.plateAlias, 'GET', token).then(function (data) {
                alert('plates');
                alert(data);
                var plates = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    plates.push(data[i].name);
                }
                return plates;
            }).then(function (plates) {
                ReactDOM.render(
                    <PlatesPart plates={plates}/>,
                    document.getElementById('js_plate')
                )
            })
        })
        
    },
    
    /**
     * 填充车辆类型
     */
    fillVehicleType: function () {
        if (!this.isFinished || !this.dataFinished) {
            return;
        }
        $('#vehicles_kind_value').val($('#js_vehicles a[data-no='+ this.data.type + ']').text());
        $('#js_vehicles a').removeClass('select');
        $('#js_vehicles a[data-no='+ this.data.type + ']').addClass('select');
    },

    // 提交信息
    submitInfo: function (event) {
        if (!yota.carNumRegExect($('#js_NO').val())) {
            alert('请输入正确的车牌号码！');
            return;
        }
        if (!yota.engineNoRegExect($('#js_engineNo').val())) {
            alert('请输入正确的发动机号码！');
            return;
        }

        var params = { 
            display_name: $('#js_displayname').val(), 
            no: $('#js_NO').val(), 
            alias: $('#vehicles_number_value').val().trim(), 
            type: $('#vehicles_kind_value').data('type') || '02', 
            engine_no: $('#js_engineNo').val()
        };
        
        var url = yota.addCarInfo;
        var method = 'POST';
       
        if (this.editUrl) {
            url = this.editUrl;
            method = 'PUT';
        }
        yota.tokenValue().then(function (token) {
            yota.requestWithStatus(url, method, token, params)
            .then(function (res) {
                // created
                if (res.status == 201 || res.status == 200) {
                    alert('操作成功');
                    location.href = './carinfo.html';
                }
                else if (res.status == 202) {
                    method == 'PUT' ? location.href = './carinfo.html' : alert('您已添加过此车辆信息！');
                }
                else {
                    alert(res.status);
                    alert(res.statusText);
                }
            })
        })
    },

    /**
     * 加载要编辑的信息 
     */
    loadEditInfo: function () {
        this.editUrl = yota.getCookie(yota.carInfoEdit);
        var base = this;
        // 显示删除信息
        $('#js_deletePart').show();
        $('#js_delete').click(function (event) {
            $('.delete_vehicles_dialog').show();
        })
        $('.delete_vehicles_dialog').click(function (event) {
            if (event 
                && event.target 
                && event.target.nodeName
                && event.target.nodeName.toLowerCase() === 'div') {
                    $('.delete_vehicles_dialog').hide();
            }
            else {
                // 删除
                if (event.target && event.target.id === 'js_yes') {
                    yota.tokenValue().then(function (token) {
                        yota.requestWithStatus(base.editUrl, 'DELETE', token, '')
                        .then(function (data) {
                            if (data.status === 204) {
                                location.href = './carinfo.html'; 
                            }
                            else {
                                $('#js_delete').hide();
                                alert('删除失败');
                            }
                        })    
                    })
                    
                }
                else {
                    $('.delete_vehicles_dialog').hide();
                }
            }
            
        })

        yota.tokenValue().then(function (token) {
            yota.request(base.editUrl, 'GET', token).then(function (data) {
                base.data = data;
                base.dataFinished = true;
                base.fillVehicleType();
                var uneditable = data.uneditable;
                $('#js_displayname').val(data.display_name); 
                $('#js_NO').val(data.no);
                if (data.no === '03') {
                    $('#vehicles_number_value').val('使');
                }
                else {
                    $('#vehicles_number_value').val(data.alias);
                }

                $('#vehicles_kind_value').data('type', data.type || '02');
                $('#js_engineNo').val(data.engine_no);

                // 只有车辆名称是可编辑的
                if (uneditable) {
                    $('#js_NO').attr('readonly', 'true');
                    $('#vehicles_number_value').attr('readonly', 'true');
                    $('#vehicles_kind_value').attr('readonly', 'true');
                    $('#js_chooseType').unbind('click');
                    $('#js_choosePlate').unbind('click');
                    $('#js_engineNo').attr('readonly', 'true');
                    $('#js_displayname').focus();
                }
                else {

                    $('#vehicles_number_value').click(function (event) {
                        var alias = $(this).val();
                        var domAlias = $('#js_plate a');
                        
                        for (var i = 0; i < domAlias.length; i++) {
                            var item = domAlias[i];
                            var val = $(item).text();
                            if (val.trim() === $(this).val().trim()) {
                                $(item).siblings().removeClass('select');
                                $(item).addClass('select');
                                break;
                            }
                        }
                    })
                }
                
            })    
        })
        
    },

    // 入口文件
    init: function () {
        // 点击选择车辆类型
        $('#js_chooseType').click(function () {
            $('#js_vehicles').show();
        })

        // 点击选择车牌号归属地
        $('#js_choosePlate').click(function () {
            $('#js_plate').show();
        })
        // 输入车牌联动部分
        $('#js_NO').blur(function (event) {
            var displayName = $('#vehicles_number_value').val().trim() + $(this).val().toUpperCase();
            $('#js_displayname').val(displayName);

        })
        // 车辆类型点击空白地方隐藏当前弹出框
        $('#js_vehicles').click(function (event) {
            if (event.target.id === this.id ) {
                $(this).hide();       
            }
        })
        // 车牌号归属地点击空白地方隐藏当前弹出框
        $('#js_plate').click(function (event) {
            if (event.target.id === this.id ) {
                $(this).hide();       
            }
        });

        // 发动机帮助
        $('#js_helpengine').click(function (event) {
            $(this).next('.mask').show();
        })
        $('.mask').click(function () {
            $(this).hide();
        })

        // 绑定保存提交事件
        $('#js_submit').click(this.submitInfo.bind(this));

        this.loadVehiclesPart();
        this.loadPlatePart();

        // 编辑状态下先加载已有信息
        var search = yota.getSearchParam();
        if (search && search.indexOf('edit') > -1) {
            this.isSearch = true;
            this.loadEditInfo();
        }
    }
}
// 开始运行
try {
    addCarInfo.init();
}
catch (e) {
    alert(e.message);
}

