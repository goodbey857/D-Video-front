import Api from "@/apis/Api";

async function follow(userAddress){
    console.log(userAddress)
    var resp = await Api().post(`/user/follow`, userAddress,{headers: {
        'Content-Type': 'text/plain' // 设置请求体的数据类型
    }} )

    if(resp.status == 200 && resp.data.code == 0){
        return resp.data;
    }
    return {code: -1}

}

async function unfollow(userAddress){
    var resp = await Api().post(`/user/unfollow`, userAddress, {
        headers: {
            'Content-Type': 'text/plain' // 设置请求体的数据类型
        }
    })

    if(resp.status == 200 && resp.data.code == 0){
        return resp.data;
    }
    return {code: -1}

}

async function getInfo(userAddress){
    var resp = await Api().get(`/user/info/${userAddress}`)
    if(resp.status == 200 && resp.data.code == 0){
        return resp.data
    }
    return {code: -1}
}

async function search(keyword){
    var resp = await Api().get(`/user/search?keyword=${keyword}`);
    if(resp.status == 200 && resp.data.code == 0){
        return resp.data.users;
    }
}

async function getFollowers(){
    var resp = await Api().get(`/user/followers`);
    if(resp.status == 200 && resp.data.code == 0){
        return resp.data.followers;
    }
    return [];
    
}

async function changeUsername(newUsername){
    var resp = await Api().post(`/user/changeUsername/${newUsername}`)
    if(resp.status == 200 && resp.data.code == 0){
        return resp.data;
    }
    return {code: -1}
}

async function changeAvatar(cid){
    var resp = await Api().post(`/user/changeAvatar/${cid}`);
    if(resp.status == 200 && resp.data.code == 0){
        return resp.data;
    }
    return {code: -1}
}


export default {
    follow,
    unfollow,
    getInfo,
    search,
    getFollowers,
    changeUsername,
    changeAvatar
}