'use strict'
var yota = require('./config');
var React = require('react');
var ReactDOM = require('react-dom');
var dateFormat = require('./dateForm');
var records = {
    currentPage: 1,
    canAskNext: 1,
    data: {},
    startY: 0,
    endY: 0,
    tag: 'time1000',
    lastRequestTime: (+new Date()),
    tags: {
        // 按时间过滤
        'time1000': 0,
        'time1': 1,
        'time3': 3,
        'time6': 6,

        // 处理状态
        'deal1000': 0,
        'deal1': 1,
        'deal-1': -1,

        // 缴款状态
        'pay1000': 0,
        'pay1': 1,
        'pay-1': -1
    },

    /**
     * 获取违章信息
     *
     * @param {string} tag 根据Tag信息处理所传参数
     * @param {number} page 页数
     */
    getViolation: function (tag, page) {
        var base = this;
        page = page || 1;
        //var url = yota.peccancies + '?page=' + page;
        var url = yota.getCookie(yota.recordsInfo);
        url += '?page=' + page;
        if (tag) {
            if (this.tags[tag]) {
                // 按照时间排序
                if (tag.indexOf('time') > -1) {
                    var date = new Date();
                    var beforeDate = new Date(dateFormat.getNewMonthDate('', this.tags[tag]));
                    var beg_date = dateFormat.toYMD(beforeDate, 'yyyy-mm-dd');
                    var end_date = dateFormat.toYMD('', 'yyyy-mm-dd'); 
                    url += '&beg_date=' + beg_date 
                        + '&end_date=' + end_date;
                }
                // 按照处理状态排序
                else if (tag.indexOf('deal') > -1) {
                    var deal = this.tags[tag] === 1 ? true : false;
                    url += '&deal=' +  deal;   
                }
                // 按照缴款状态排序
                else if (tag.indexOf('pay') > -1) {
                    var pay = this.tags[tag] === 1 ? true : false;
                    url += '&penalty=' + pay;
                }    
            }
        }
        
        var timeTag = $('.filter_time li input:checked').parent().find('label').data('tag');
        var dealTag = $('.process_state li input:checked').parent().find('label').data('tag');
        var penaltyTag = $('.process_penality li input:checked').parent().find('label').data('tag');
        //console.log(timeTag, this.tags[timeTag]);
        // 日期筛选
        if (!(tag && tag.indexOf('time') > -1) 
            && timeTag && this.tags[timeTag]) {
            var date = new Date();
            var beforeDate = new Date(dateFormat.getNewMonthDate('', this.tags[timeTag]));
            var beg_date = dateFormat.toYMD(beforeDate, 'yyyy-mm-dd');
            var end_date = dateFormat.toYMD('', 'yyyy-mm-dd');
            url += '&beg_date=' + beg_date 
                + '&end_date=' + end_date;
        }
        // 处理状态
        if (!(tag && tag.indexOf('deal') > -1) 
            && dealTag && this.tags[dealTag]) {
            var deal = this.tags[dealTag] === 1 ? true : false;
            url += '&deal=' +  deal;   
        }

        // 缴款状态
        if (!(tag && tag.indexOf('pay') > -1)
            && penaltyTag && this.tags[penaltyTag]) {
            var pay = this.tags[penaltyTag] === 1 ? true : false;
            url += '&penalty=' + pay;
        }
        // 如果有页数
        if (page === 1) {
            document.getElementById('js_list').innerHTML = '';
            yota.tokenValue().then(function (token) {
                yota.request(url, 'GET', token).then(base.dealInformation.bind(base));
            })
        }
        else {
            yota.tokenValue().then(function (token) {
                yota.request(url, 'GET', token).then(base.dealInformation.bind(base));
            })
        }
        
    },

    // 控件
    Violation: React.createClass({

        render: function () {
            var penalty = '未缴款';
            var penaltyClass = 'red';
            if (this.props.data.penalty) {
                penalty = '已缴款';
                penaltyClass = 'adopt';
            }
            var deal = '未处理';
            var dealClass = 'red';
            if (this.props.data.deal) {
                deal = '已处理';
                dealClass = 'adopt';
            }
            var violationTime = this.props.data.time.replace('T', ' ');
            var updateTime = this.props.data.update_time.replace('T', ' ');
            return (<ul className="ul_style">
                <li className="endorse_time">违章时间：{violationTime}</li>
                <li>违章地点：{this.props.data.place}</li>
                <li>违章行为：{this.props.data.action}</li>
                <li>处理状态：<span className={dealClass}>{deal}</span> &nbsp;&nbsp;缴款状态：
                    <span className={penaltyClass}>{penalty}</span>
                </li>
                <li className="color9">更新时间:{updateTime}</li>
            </ul>)
        }
    }),
    
    // 下拉刷新
    refresh: function () {
        window.location.reload();
    },

    /**
     * 处理数据
     * @param {object} data 数据
     */
    dealInformation: function (data) {
        var Violation = this.Violation;
        var items = data.items;
        if (items.length <= 0) {
            this.canAskNext = 0;
            return;
        }
        if (this.currentPage > 1) {
            this.lastRequestTime = (+new Date());
        }
        this.data[this.tag] = this.data[this.tag] || [];
        this.data[this.tag] = this.data[this.tag].concat(items);
        items = this.data[this.tag];
        
        ReactDOM.render(
            <div className="endorse_info_list" >
            {
                items.map(function (obj, index) {
                    return <Violation data={obj}/>
                })
            }
            </div>
            ,
            document.getElementById('js_list')
        );
        
    },
    
    chooseByOption: function (event) {
        $(this).siblings('div').hide();
        $(this).next('div').show();
        $('.endorse_info_tab a').removeClass('select');
        $(this).addClass('select');
    },

    // 入口
    init: function () {
        var name = decodeURIComponent(yota.getSearchParam());
        name = name.split('=')[1];
        $('title').text(name + '违章记录');
        var base = this;
        // 点击选项响应
        $('#js_status, #js_penality, #js_time').click(this.chooseByOption);
        $('#js_status, #js_penality, #js_time').next('div').click(function (event) {
            var target = event.target;
            if (target.className === $(this)[0].className) {
                $(this).hide();
            }
            else {
                if (target.tagName && target.tagName.toLowerCase() === 'label') {
                    var tag = $(target).data('tag');
                    // 分页
                    base.canAskNext = 1;
                    base.currentPage = 1;
                    base.data[tag] = [];
                    base.tag = tag;
                    base.getViolation(tag);
                    $(this).hide();
                }
                
            }
        });

        // 获取违章信息
        this.getViolation();

        // 下拉刷新
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

        　　if(scrollTop + windowHeight >= scrollHeight 
                && base.canAskNext 
                && now - base.lastRequestTime > 200
                && (base.endY - base.startY) < -1) {
        　　　　// 请求下一页
                base.currentPage += 1;
                base.getViolation(base.tag, base.currentPage);
        　　}
            // reload
            if ((base.endY - base.startY) < -1 && document.body.scrollTop <= 0) {
                base.refresh();
            }
        });
    }
};

// 开始运行
records.init();