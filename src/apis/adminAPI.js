import Api from "@/apis/Api";

async function getUserData(address,page, size, orderBy, desc){
    var resp = await Api().get("/admin/userData", {
        params: {
            address: address,
            page: page,
            size: size,
            orderBy: orderBy,
            desc: desc,
        },
        paramsSerializer: function (params) {
            return Object.keys(params)
                .map(repeatArrayParam(params))
                .join('&');
        }
    });
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

function repeatArrayParam(params) {
    return key => {
        const value = params[key];
        if (Array.isArray(value) && value.length > 0) {
            return value.map((item) => `${key}=${item}`).join('&');
        }else if(value == undefined){
            return `${key}=`;
        } else {
            return `${key}=${value}`;
        }
    };
}

async function addToBlockList(address){
    var resp = await Api().put("/admin/blackList/".concat(address));
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 } 

}

async function removeFromBlockList(address){
    var resp = await Api().delete("/admin/blackList/".concat(address));
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
}

async function getAllVideoData(page, size, search, orderBy, desc){
    var resp = await Api().get("/admin/videoData", {
        params: {
            page: page,
            size: size,
            search: search,
            orderBy: orderBy,
            desc: desc,
        },
        paramsSerializer: function (params) {
            return Object.keys(params)
                .map(repeatArrayParam(params)).join('&');
        }
    }
    );
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 } 
}

async function getAllCommentData(page, size, search, orderBy, desc){
    var resp = await Api().get("/admin/commentData", {
        params: {
            page: page,
            size: size,
            search: search,
            orderBy: orderBy,
            desc: desc,
        },
        paramsSerializer: function (params) {
            return Object.keys(params)
                .map(repeatArrayParam(params)).join('&');
        }
    }
    );
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

async function getVideoTransferData(address, page,size){
    var resp = await Api().get("/admin/videoTransferData", {
        params: {
            address: address,
            page: page,
            size: size,
        },
        paramsSerializer: function (params) {
            return Object.keys(params)
                .map(repeatArrayParam(params)).join('&');
        }
    }
    );
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 } 

}

async function getRewardData(address, page,size){
    var resp = await Api().get("/admin/rewardData", {
        params: {
            address: address,
            page: page,
            size: size,
        },
        paramsSerializer: function (params) {
            return Object.keys(params)
                .map(repeatArrayParam(params)).join('&');
                
        }
        
    }
    );
    if (resp.status == 200 && resp.data.code == 0) {
        return resp.data;
    }
    return { code: -1 }
}

export default {
    getUserData,
    addToBlockList,
    removeFromBlockList,
    getAllVideoData,
    getAllCommentData,
    getVideoTransferData,
    getRewardData
}