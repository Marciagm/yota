'use strict'
var yota = require('./config');
var React = require('react');
var ReactDOM = require('react-dom');

var addLicense = {
    // 是否不可编辑
    uneditable: false,

    // 获取省市
    getLocation: function () {
        var base = this;
        yota.tokenValue().then(function (token) {
            yota.request(yota.region, 'GET', token).then(base.dealInformation.bind(base));
        })
    },

    /**
     * 处理返回的数据
     * 
     * @param {object} data 返回的数据
     */
    dealInformation: function (data) {
        var handleClick = this.chooseProvince.bind(this);
        this.cities = {};
        var base = this;
        ReactDOM.render(<div>
                {
                    data.map(function (obj, index) {
                        if (obj.city && obj.city.length > 0) {
                            base.cities[obj.id] = obj.city;
                        }
                        return <a className="province_option" onClick={handleClick} data-id={obj.id}>{obj.name}</a>
                    })
                }
            </div>
            ,
            document.getElementById('js_province')
        )
                    // 编辑状态下先加载已有信息
        var search = yota.getSearchParam();
        if (search && search.indexOf('edit') > -1) {
            base.loadEditInfo();
        }
    },

    // 添加保存
    submitInfo: function (event) {
        if (!yota.licenseNoExec($('#js_licenseNO').val())) {
            alert('驾驶证由数字和字母组成，且最大长度为18位！');
            return;
        }
        // 档案编号
        if (!yota.fileNoExec($('#js_fileNO').val())) {
            alert('档案编号为数字，且最大长度为12位！');
            return;
        }
        if (!$('#province_value').data('id')) {
            alert('请选择发证机关！');
            return;
        }
        var params = {
            'display_name': $('#js_displayname').val(),
            'region': $('#city_value').data('id') ? $('#city_value').data('id') : $('#province_value').data('id'),
            'license_no': $('#js_licenseNO').val(),
            'archive_no': $('#js_fileNO').val()
        };
        yota.tokenValue().then(function (token) {
            yota.requestWithStatus(yota.addLicense, 'POST', token, params).then(function (data) {
                if (data && data.status == 201) {
                    alert('添加成功!');
                    location.href = 'license.html';
                }
                else if (data && data.status == 202) {
                    alert('您已经添加此信息！');
                }
                else {
                    alert('添加失败！ ' + data.statusText);
                }
            })
        })
    },
    
    chooseCity: function (event, target) {
        var target = target || event.target;
        var id = $(target).data('id');
        var val = $(target).text();
        $('#city_value').val(val);
        $('#city_value').data('id', id);
        $(target).siblings().removeClass('select');
        $(target).addClass('select');
        $('#js_city_list').hide();
    },

    /**
     * 选择省
     * 
     * @param {object} event 点击事件
     * @param {object} target 点击对象
     * @param {string} id 城市id
     */
    chooseProvince: function (event, target, cityId) {
        var target = target || event.target;
        var id = $(target).data('id');
        var val = $(target).text();
        $('#province_value').val(val);
        $('#province_value').data('id', id);
        $(target).siblings().removeClass('select');
        $(target).addClass('select');
        $('#city_value').val('市');
        $('#js_city').hide();
        var handleClick = this.chooseCity;
        if (this.cities[id]) {
            ReactDOM.render(<div>
                {
                    this.cities[id].map(function (obj, index) {
                        return <a className="city_option" data-id={obj.id} onClick={handleClick}>{obj.name}</a>
                    })
                }
                </div>
                ,
                document.getElementById('js_city_list')
            );
            $('#js_city').show();
            // 绑定点击事件
            $('#js_city').click(function (event) {
                $('#js_city_list').show();
            })
        }
        else {
            $('#city_value').removeAttr('data-id');
        }
        $('#js_province').hide();
        console.log(cityId);
        if (cityId && /^\d*$/.test(cityId)) {
            $('#js_city').show();
            var cityTarget = $('.city_option[data-id='+ cityId + ']')[0];
            handleClick('', cityTarget);
            if (this.uneditable) {
                $('#js_choosepro').unbind('click');
                $('#js_city').unbind('click');
            }      
        }
    },
    // 隐藏帮助信息
    helpInfoHide: function (event) {
        $(this).hide();
    },

    // 显示帮助信息
    helpInfoShow: function (event) {
        $(this).next('.mask').show();
    },
    // 编辑状态
    loadEditInfo: function () {
        this.editUrl = yota.getCookie(yota.licenseInfoEdit);
        var base = this;
        $('#js_deletePart').show();
        $('#js_delete').click(function (event) {
            $('.delete_driverLicense_dialog').show();
        });
        $('.delete_driverLicense_dialog').click(function (event) {
            if (event 
                && event.target 
                && event.target.nodeName
                && event.target.nodeName.toLowerCase() === 'div') {
                    $('.delete_driverLicense_dialog').hide();
            }
            else {
                // 删除
                if (event.target && event.target.id === 'js_yes') {
                    yota.tokenValue().then(function (token) {
                        yota.requestWithStatus(base.editUrl, 'DELETE', token, '')
                        .then(function (data) {
                            if (data.status === 204) {
                                $('#js_deletePart').hide();
                                location.href = './license.html';
                            }
                            else {
                                $('#js_deletePart').hide();
                                alert('删除失败');
                            }
                        })
                    })
                }
                else {
                    $('.delete_driverLicense_dialog').hide();
                }
            }
            
        })
        yota.tokenValue().then(function (token) {
            yota.request(base.editUrl, 'GET', token).then(function (data) {
                var uneditable = data.uneditable;
                var region = data.region;
                var parent = region.parent;
                var id = region.id;
                $('#js_licenseNO').val(data.license_no);
                $('#js_fileNO').val(data.archive_no);
                $('#js_displayname').val(data.display_name);
                
                if (!!parent) {
                    var targetRegion = $('#js_province a[data-id=' + parent + ']');
                    base.chooseProvince('', targetRegion, id);
                }
                else {
                    var targetRegion = $('#js_province a[data-id=' + id + ']')[0];
                    base.chooseProvince('', targetRegion);
                }

                if (uneditable) {
                    base.uneditable = uneditable;
                    $('#js_licenseNO').attr('readonly', 'true');
                    $('#js_fileNO').attr('readonly', 'true');
                    $('#js_choosepro').unbind('click');
                    $('#js_city').unbind('click');
                    $('#js_displayname').focus();
                }
            })
        })
        
    },

    init: function () {
        $('#js_submit').click(this.submitInfo.bind(this));
        // 点击空白地方隐藏
        $('#js_province').click(function (event) {
            if (event.target.id === $(this).attr('id')) {
                $(this).hide();
            }
        })
        
        $('#js_choosepro').click(function (event) {
            $('.province_choose').toggle();
        })
        $('#city_value').click(function (event) {
            $('.city_choose').toggle();
        })

        // 点击驾驶证号帮助
        $('#js_helplicenseNO').click(this.helpInfoShow);
        $('#js_helpfileNO').click(this.helpInfoShow);
        $('.mask').click(this.helpInfoHide);
        this.getLocation();

    }
};

// 开始运行
addLicense.init();

 ///选择车牌归属地事件
/*$(function(){
    $('.city_option').click(function(){
        var _val=$(this).text();
        $(this).siblings('.city_option').removeClass('select');
        $(this).addClass('select');
        $('#city_value').val(_val);
        $(".city_choose").hide();

    })
})*/