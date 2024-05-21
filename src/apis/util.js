



function formatNum(num){
    return num < 1000 ? num+"" : (num / 1000).toFixed(1) +"k";
}

function formatDate(dateStamp){
    if(typeof dateStamp === "string"){
        dateStamp = new Date(dateStamp).getTime();
    }
    var now = new Date().getTime();
    var diffValue = now - dateStamp - + 8 * 60 * 60 * 1000;//时间差的毫秒数
    var diffDate = new Date(diffValue)
    if(diffDate.getFullYear()-1970>0){
        return diffDate.getFullYear() - 1970 + " 年前"
    }else if(diffDate.getMonth()>0){
        return diffDate.getMonth() + " 个月前"
    }else if(diffDate.getDate()>1){
        return diffDate.getDate() + " 天前"
    }else if(diffDate.getHours()>0){
        return diffDate.getHours() + " 小时前"
    }else if(diffDate.getMinutes()>0){
        return diffDate.getMinutes() + " 分钟前"
    }else if(diffDate.getSeconds()>0){
        return diffDate.getSeconds() + " 秒前"
    }

}

export default {
    formatNum,
    formatDate
};