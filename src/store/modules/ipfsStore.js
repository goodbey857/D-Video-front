const state = {
    ipfsGateway: localStorage.getItem('ipfsGateway') || 'http://192.168.1.111:8080',
    ipfsGatewayList: JSON.parse(localStorage.getItem('ipfsGatewayList')) || ['http://192.168.1.111:8080'],
    ipfsRpc: localStorage.getItem('ipfsRpc') || 'http://192.168.1.111:5001',
    ipfsRpcList: JSON.parse(localStorage.getItem('ipfsRpcList')) || ['http://192.168.1.111:5001','http://localhost:5001'],
    arbscan: "https://sepolia.arbiscan.io/tx/",
}
const getters = {
    currentIpfsGateway: state => {
        return state.ipfsGateway+"/ipfs/";
    },
    ipfsGateway: state => {
        return state.ipfsGateway;
    },

    ipfsGatewayList: state => {
        return state.ipfsGatewayList;
    },

    ipfsRpc: state => {
        return state.ipfsRpc;
    },

    ipfsRpcList: state => {
        return state.ipfsRpcList;
    },
    currentEtherscanGateway() {
        return state.arbscan
    }
}

const mutations = {
    addIpfsGateway(state, gateway) {
        if (state.ipfsGatewayList.indexOf(gateway) === -1) {
            state.ipfsGatewayList.push(gateway);
            localStorage.setItem('ipfsGatewayList', JSON.stringify(state.ipfsGatewayList));
        }
    },

    setIpfsGateway(state, gateway) {
        state.ipfsGateway = gateway;
        localStorage.setItem('ipfsGateway', gateway);
    },

    addIpfsRpc(state, rpc) {
        if (state.ipfsRpcList.indexOf(rpc) === -1) {
            state.ipfsRpcList.push(rpc);
            localStorage.setItem('ipfsRpcList', JSON.stringify(state.ipfsRpcList));
        }
    },

    setIpfsRpc(state, rpc) {
        state.ipfsRpc = rpc;
        localStorage.setItem('ipfsRpc', rpc);
    },
}

const actions = {
}

export default {
    state,
    getters,
    mutations,
    actions,
}