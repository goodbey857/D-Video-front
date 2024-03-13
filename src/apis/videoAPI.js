import Api from "@/apis/Api";

async function getNewVideos(page,size){
    var videosResp = await Api().get(`/video/new/${page}/${size}`);
    if(videosResp.status == 200 && videosResp.data.code == 0){
        return videosResp.data.data;
    }
    return [];
}

async function getHotVideos(page,size){
    var videosResp = await Api().get(`/video/hot/${page}/${size}`);
    if(videosResp.status == 200 && videosResp.data.code == 0){
        return videosResp.data.data;
    }
    return [];
}

async function getVideoDetail(id){
    var videoResp = await Api().get(`/video/detail/${id}`);
    if (videoResp.status == 200 && videoResp.data.code == 0) {
        return videoResp.data;
    }
    return null;
}

async function like(id){
    var likeResp = await Api().get(`/video/like/${id}`);
    if (likeResp.status == 200 && likeResp.data.code == 0) {
        return likeResp.data;
    }
    return { code: -1 }
    
}

async function unlike(id){
    var unlikeResp = await Api().get(`/video/unlike/${id}`);
    if (unlikeResp.status == 200 && unlikeResp.data.code == 0) {
        return unlikeResp.data;
    }
    return { code: -1 }
}

async function star(id){
    var starResp = await Api().get(`/video/star/${id}`);
    if (starResp.status == 200 && starResp.data.code == 0) {
        return starResp.data;
    }
    return { code: -1 }
}


async function unstar(id){
    var unstarResp = await Api().get(`/video/unstar/${id}`);
    if (unstarResp.status == 200 && unstarResp.data.code == 0) {
        return unstarResp.data;
    }

    return {code: -1}
}

async function getSeriesVideos(id){
    var seriesVideoListResp = await Api().get(`/video/series/${id}`);
    if (seriesVideoListResp.status == 200 && seriesVideoListResp.data.code == 0) {
        return seriesVideoListResp.data;
    }
    return { code: -1};
}

async function getFollowVideos(page,size){
    var followVideoListResp = await Api().get(`/video/follow/${page}/${size}`);
    if (followVideoListResp.status == 200 && followVideoListResp.data.code == 0) {
        return followVideoListResp.data.data;
    }
    return { code: -1};
}

async function getSomeBodyVideos(id,page,size){
    var someBodyVideoListResp = await Api().get(`/video/somebody/${id}/${page}/${size}`);
    if (someBodyVideoListResp.status == 200 && someBodyVideoListResp.data.code == 0) {
        return someBodyVideoListResp.data;
    }
    return { code: -1};
}

async function getSeriesList(address){
    var seriesListResp = await Api().get(`/video/series/list/${address}`);
    if (seriesListResp.status == 200 && seriesListResp.data.code == 0) {
        return seriesListResp.data;
    }
    return { code: -1};
}

export default {
    getNewVideos,
    getHotVideos, 
    getVideoDetail,
    like,
    unlike,
    star,
    unstar,
    getSeriesVideos,
    getFollowVideos,
    getSomeBodyVideos,
    getSeriesList
}