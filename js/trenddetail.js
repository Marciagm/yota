var yota = require('./config');
var trendDetail = {
    init: function () {
        var base = this;
        var search = yota.getSearchParam();
        if (search && search.indexOf('id=') > -1) {
            this.id = search.split('=')[1];
        }
        if (!this.id) {
            return;
        }
        var uri = decodeURIComponent(yota.getCookie(yota.historyDetail + this.id));
        yota.tokenValue().then(function (token) {
            yota.request(uri, 'GET', token).then(function (res) {
                base.loadData(res);
            })
        })
        

    },
    loadData: function (dataValue) {
       // 设置calendar div中的html部分
        renderHtml();
        // 表格中显示日期
        showCalendarData('2016, 8');
        /**
         * 渲染html结构
         */
        function renderHtml() {
            var calendar = document.getElementById("calendar");
            var titleBox = document.createElement("div");  // 标题盒子 设置上一月 下一月 标题
            var bodyBox = document.createElement("div");  // 表格区 显示数据

            // 设置标题盒子中的html
            titleBox.className = 'calendar-title-box';
            titleBox.innerHTML = "<span class='prev-month' id='prevMonth'></span>" +
                    "<span class='calendar-title' id='calendarTitle'></span>" +
                    "<span id='nextMonth' class='next-month'></span>";
            calendar.appendChild(titleBox);    // 添加到calendar div中

            // 设置表格区的html结构
            bodyBox.className = 'calendar-body-box';
            var _headHtml = "<tr>" +
                    "<th>日</th>" +
                    "<th>一</th>" +
                    "<th>二</th>" +
                    "<th>三</th>" +
                    "<th>四</th>" +
                    "<th>五</th>" +
                    "<th>六</th>" +
                    "</tr>";
            var _bodyHtml = "";

            // 一个月最多31天，所以一个月最多占6行表格
            for(var i = 0; i < 6; i++) {
                _bodyHtml += "<tr>" +
                        "<td></td>" +
                        "<td></td>" +
                        "<td></td>" +
                        "<td></td>" +
                        "<td></td>" +
                        "<td></td>" +
                        "<td></td>" +
                        "</tr>";
            }
            bodyBox.innerHTML = "<table id='calendarTable' class='calendar-table'>" +
                    _headHtml + _bodyHtml +
                    "</table>";
            // 添加到calendar div中
            calendar.appendChild(bodyBox);
        }

        /**
         * 表格中显示数据，并设置类名
         */
        function showCalendarData(dateparam,arr) {//arr代表所取得的分数数组

            var _date;
            var _year ;
            var _month;
            var _dateStr
             _date = new Date(dateparam);    // 月是从0开始计数， 需要减一
             _year =_date.getFullYear();
             _month = _date.getMonth() + 1;
             _dateStr = getDateStr(_date);

            // 设置顶部标题栏中的 年、月信息
            var calendarTitle = document.getElementById("calendarTitle");
            var titleStr = _dateStr.substr(0, 4) + "年" + _dateStr.substr(4,2) + "月";
            calendarTitle.innerText = titleStr;

            // 设置表格中的日期数据
            var _table = document.getElementById("calendarTable");
            var _tds = _table.getElementsByTagName("td");
            var _firstDay = new Date(_year, _month - 1, 1);  // 当前月第一天
            for(var i = 0; i < _tds.length; i++) {
                var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
                var _thisDayStr = getDateStr(_thisDay);
                var score = 0;
                for (var k = 0, len = dataValue.length; k < len; k++) {
                    if (i == dataValue[k].day) {
                        score = dataValue[k].score;
                        break;
                    }    
                }
                if (score) {
                    _tds[i].innerHTML = _thisDay.getDate()
                    + '<span class="mark">'
                    + score 
                    +'分</span>';
                }
                else {
                    _tds[i].innerHTML = _thisDay.getDate()
                    + '<span class="markZero">'
                    + score 
                    +'分</span>';    
                }
                
                //_tds[i].data = _thisDayStr;
                _tds[i].setAttribute('data', _thisDayStr);
                if(_thisDayStr == getDateStr(new Date())) {    // 当前天
                    _tds[i].className = 'currentDay';
                }else if(_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
                    _tds[i].className = 'currentMonth';  // 当前月
                }else {    // 其他月
                    _tds[i].className = 'otherMonth';
                }
            }
        }
        /**
         * 日期转化为字符串， 4位年+2位月+2位日
         */
        function getDateStr(date) {
            var _year = date.getFullYear();
            var _month = date.getMonth() + 1;    // 月从0开始计数
            var _d = date.getDate();

            _month = (_month > 9) ? ("" + _month) : ("0" + _month);
            _d = (_d > 9) ? ("" + _d) : ("0" + _d);
            return _year + _month + _d;
        }
    }
};
trendDetail.init();
