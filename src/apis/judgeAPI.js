import Api from "@/apis/Api";
function repeatArrayParam(params) {
    return key => {
        const value = params[key];
        if (Array.isArray(value) && value.length > 0) {
            return value.map((item) => `${key}=${item}`).join('&');
        } else if (value == undefined) {
            return `${key}=`;
        } else {
            return `${key}=${value}`;
        }
    };
}


async function report(videoId,reason){
    var resp = await Api().get("/judge/report", {
        params:{
            videoId:videoId,
            reason:reason
        },
        paramsSerializer: function (params) {
            return Object.keys(params)
                .map(repeatArrayParam(params)).join('&');
        }
        
    });
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function all(page,size){
    var resp = await Api().get("/judge/all", {
        params:{
            page:page,
            size:size
        }
    });
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function judge(reviewId,status){
    var resp = await Api().get("/judge/judge", {
        params:{
            reviewId:reviewId,
            status:status
        }
    });
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

export default {
    report,
    all,
    judge

}