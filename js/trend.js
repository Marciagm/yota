var yota = require('./config');

var trend = {
    init: function () {
        var search = yota.getSearchParam();
        if (search && search.indexOf('id=') > -1) {
            this.id = search.split('=')[1];
            this.id = this.id.split('&')[0];
            console.log(this.id);
        }
        var base = this;
        $('#select_year').addEventListener('change', function (event) {
            var year = $(this).value;
            console.log(year);
            if (year != base.currentYear) {
                base.currentYear = year;
                base.loadInfo(year);   
            }
        })

        this.currentYear = $('#select_year').value;
        this.loadInfo(this.currentYear);
    },

    loadInfo: function (yearIndex) {
        var base = this;
        var yearInfo = {};
        /*var data = [
            {name : '1',  value :0,  color : '#FF6837'},
            {name : '2',  value :0,  color : '#FF6837'},
            {name : '3',  value :0,  color : '#FF6837'},
            {name : '4',  value :0,  color : '#FF6837'},
            {name : '5',  value :0,  color : '#FF6837'},
            {name : '6',  value :0,  color : '#FF6837'},
            {name : '7',  value :0,  color : '#FF6837'},
            {name : '8',  value :0,  color : '#FF6837'},
            {name : '9',  value :0,  color : '#FF6837'},
            {name : '10', value: 0,  color : '#FF6837'},
            {name : '11', value: 0,  color : '#FF6837'},
            {name : '12', value: 0,  color : '#FF6837'}
        ];*/
        var data = [];
        var demerit_uri = yota.getCookie(yota.historyInfo);
        if (!demerit_uri) {
            demerit_uri = yota.apiHost + '/license/demerit/year/' + this.id;
        }
        if (yearIndex) {
            demerit_uri += '?year=' + yearIndex;   
        }
        yota.tokenValue().then(function (token) {
            // 年份
            yota.request(demerit_uri, 'GET', token).then(function (res) {
                for (var i = 0, len = res.length; i < res.length; i++) {
                    data[i] = {};
                    var item = res[i];
                    var month = item.month;
                    var year = item.link.args.year;
                    var month = item.link.args.month;
                    console.log('yearIndex: ' + yearIndex + ';year: ' + year);

                    if (yearIndex == year) {
                        data[i].name = month;
                        data[i].value = item.score;
                        data[i].color = '#FF6837';
                        //data[month - 1].value = item.score;    
                    }
                    
                    yearInfo[year] = yearInfo[year] || {};
                    yearInfo[year][month] = item.score;
                    base.month = item.link.uri;
                    yota.setCookie(yota.month + month, item.link.uri);
                }
                var widthRatio = res.length / 12 * 100 + '%';
                console.log(widthRatio);
                var chart = new iChart.Column2D({
                    render : 'canvasDiv',
                    data : data,
                    id: "canvasDiv_id" + new Date().getTime(),
                    fit: true,
                    label : {
                        fontsize:15,
                        fontweight:600,
                        color : '#666666'
                    },
                    sub_option : {
                        listeners : {
                            parseText : function(r, t) {
                                if(t==0||t==null){return 0 }
                                else{return t + "分";}
                            },
                            click: function(r,e,m) {
                                var sel=document.getElementById("select_year");
                                var index = sel.selectedIndex; // 选中索引
                                albumid= sel.options[index].value;//要的值
                                alert(albumid+'年' + r.get('name') + '月  '+r.get('value'));
                                var daysDetail = base.month
                                + '?year='
                                + albumid
                                + '&month=' 
                                + r.get('name');
                                console.log(daysDetail);
                                yota.setCookie(yota.historyDetail + base.id, encodeURIComponent(daysDetail));
                                location.href = './trenddetail.html?id=' + base.id;
                                //window.open('./trenddetail.html?id=' + base.id);
                            }
                        },
                        label : {
                            fontsize:15,
                            fontweight:600,
                            color : '#666666'
                        }
                    },
                    coordinate : {
                        background_color : null,
                        grid_color : 'white',
                        width : widthRatio,
                        height : '80%',
                        offsety:-200,
                        axis : {
                            color : '#ececec',
                            width : [0, 0, 10, 0]
                        },
                        scale : [{
                            position : 'left',
                            start_scale : 0,
                            end_scale : 30,
                            scale_space : 1,
                            scale_enable : false,
                            label : {
                                fontsize:0,
                                fontweight:600,
                                color : 'white'
                            }
                        }]
                    }
                });
                chart.draw();    
            }) 
        })
               
    }
};
$(function () {
    trend.init();  
})