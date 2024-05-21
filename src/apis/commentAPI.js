import Api from "@/apis/Api";

async function comment(videoId, content, replayTo){
    var commentResp = await Api().post(`/comment`, {
        videoId: videoId,
        content: content,
        replayTo: replayTo
     
    })
    if (commentResp.status == 200 && commentResp.data.code == 0) {
        return commentResp.data;
    }
    return {code: -1}
}

async function getComments(videoId,page,size){
    var commentResp = await Api().get(`/comment/${videoId}/${page}/${size}`)
    if (commentResp.status == 200 && commentResp.data.code == 0) {
        return commentResp.data;
    }
    return {code: -1}
}

async function getCommentByAddress(address,page,size){
    var commentResp = await Api().get(`/comment/videoOwn/${address}/${page}/${size}`)
    if (commentResp.status == 200 && commentResp.data.code == 0) {
        return commentResp.data;
    }
    return {code: -1}
}

export default {
    comment,
    getComments,
    getCommentByAddress
}