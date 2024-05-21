import Api from "@/apis/Api";

async function analyzeDurationView(duration){
    var resp = await Api().get("/analyze/analyzeView/"+duration);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeView(id){
    var resp = await Api().get("/analyze/view/"+id);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeTotalView(address){
    var resp = await Api().get("/analyze/totalView/"+address);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeLikeCount(id){
    var resp = await Api().get("/analyze/like/"+id);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeTotalLikeCount(address){
    var resp = await Api().get("/analyze/totalLike/"+address);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeStarCount(id){
    var resp = await Api().get("/analyze/star/"+id);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeTotalStarCount(address){
    var resp = await Api().get("/analyze/totalStar/"+address);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeCommentCount(id){
    var resp = await Api().get("/analyze/comment/"+id);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeTotalCommentCount(address){
    var resp = await Api().get("/analyze/totalComment/"+address);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeFanCount(address){
    var resp = await Api().get("/analyze/fans/"+address);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeFollowerCount(address){
    var resp = await Api().get("/analyze/follower/"+address);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

async function analyzeVideoCount(address){
    var resp = await Api().get("/analyze/videoCount/"+address);
    if(resp.status == 200 && resp.data.code == 0)
        return resp.data;
    return { code: -1}
}

export default{
    analyzeTotalView,
    analyzeDurationView,
    analyzeView,
    analyzeTotalStarCount,
    analyzeCommentCount,
    analyzeTotalCommentCount,
    analyzeFanCount,
    analyzeFollowerCount,
    analyzeLikeCount,
    analyzeTotalLikeCount,
    analyzeStarCount,
    analyzeVideoCount
}