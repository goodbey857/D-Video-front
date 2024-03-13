const state = {
    ipfsGateway: localStorage.getItem('ipfsGateway') || 'http://192.168.1.111:8080',
    ipfsGatewayList: localStorage.getItem('ipfsGatewayList') || ['http://192.168.1.111:8080'],
}
const getters = {
    currentIpfsGateway: state => {
        return state.ipfsGateway+"/ipfs/";
    },

    ipfsGatewayList: state => {
        return state.ipfsGatewayList;
    }
}

const mutations = {
    addIpfsGateway(state, gateway) {
        if (state.ipfsGatewayList.indexOf(gateway) === -1) {
            state.ipfsGatewayList.push(gateway);
        }
    },

    setIpfsGateway(state, gateway) {
        state.ipfsGateway = gateway;
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