



function formatNum(num){
    return num < 1000 ? num : (num / 1000).toFixed(1) +"k";
}

function formatDate(dateStamp){
    var now = new Date().getTime();
    var diffValue = now - dateStamp;//时间差的毫秒数
    var diffDate = new Date(diffValue)
    if(diffDate.getFullYear()-1970>0){
        return diffDate.getFullYear() - 1970 + " year ago"
    }else if(diffDate.getMonth()>0){
        return diffDate.getMonth() + " month ago"
    }else if(diffDate.getDate()>0){
        return diffDate.getDate() + " day ago"
    }else if(diffDate.getHours()>0){
        return diffDate.getHours() + " hour ago"
    }else if(diffDate.getMinutes()>0){
        return diffDate.getMinutes() + " minute ago"
    }else if(diffDate.getSeconds()>0){
        return diffDate.getSeconds() + " second ago"
    }

}

export default {
    formatNum,
    formatDate
};