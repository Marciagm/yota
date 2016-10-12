'use strict'
var dateForm = {
    /**
     * 转换为’年月日‘日期格式，连接符用户自定义
     *
     * @param {date} date new Date()格式，默认为当前时间
     * @param {string} format 格式
     */
    toYMD: function (date, format) {

        date = date || new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() - 0 + 1) < 10 
                    ? '0' + (date.getMonth() - 0 + 1) 
                    : (date.getMonth() - 0 + 1);

        var day = date.getDate();

        if (format === 'yyyy-mm-dd' ) {
            var dateString = year + '-' 
                 + month + '-'
                 + day;
            return dateString;
        }
    },

    /**
     * 比如获取三个月前的日期
     */
    getNewMonthDate: function (date, num) {
        console.log('num: ' + num);
        date = date || new Date();
        var month = date.getMonth();
        if ((month - 0 + 1) <= parseInt(num)) {
            date.setFullYear(date.getFullYear() - 1);
            date.setMonth(11 - num + date.getMonth());
        }
        else {
            date.setMonth(date.getMonth() - num)
        }
        return date;
    }
}
module.exports = dateForm;