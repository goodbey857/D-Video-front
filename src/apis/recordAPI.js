import Api from "@/apis/Api";

async function postSearch(keyword){
    var resp = await Api().post("/record/search", keyword, {
        headers: {
            'Content-Type': 'text/plain' // 设置请求体的数据类型
        }
    });
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }

}

async function getSearch(){
    var resp = await Api().get("/record/search");
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
    
}

async function deleteSearch(id){
    var resp = await Api().delete("/record/search/"+id);
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function getComment(){
    var resp = await Api().get("/record/comments");
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function deleteComment(id){
    var resp = await Api().delete("/record/comments/"+id);
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function getVideo(){
    var resp = await Api().get("/record/video");
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function deleteVideo(id){
    var resp = await Api().delete("/record/video/"+id);
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function videoTransferRecord(page,size){
    var resp = await Api().get(`/record/videoTransfer/${page}/${size}`);
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function tokenTransferRecord(page,size){
    var resp = await Api().get(`/record/tokenTransfer/${page}/${size}`);
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

export default {
    postSearch,
    getSearch,
    deleteSearch,
    getComment,
    deleteComment,
    getVideo,
    deleteVideo,
    videoTransferRecord,
    tokenTransferRecord
};