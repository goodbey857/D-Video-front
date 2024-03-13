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



export default {
    follow,
    unfollow,
    getInfo,
}