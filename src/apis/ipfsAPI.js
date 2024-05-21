import { create, globSource } from 'kubo-rpc-client'


var ipfsApi = "http://192.168.1.111:5001/"

const client = create(new URL(ipfsApi))

// call Core API methods
var filepath = "E:/本机/下载/18-58-55.png"
const { cid } = await client.add(globSource(filepath));
console.log(cid)