import authAPI from '@/apis/authAPI'

const state = {
    address: localStorage.getItem('address'),
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isUserLoggedIn: localStorage.getItem('token') || false
}

const getters = {
    userAddress: (state) => {
        return state.address
    },
    isAuthenticated: (state) => {
        return state.isUserLoggedIn
    },
    getToken: (state) => {
        return state.token
    },
    currentUser: (state) => {
        return state.user
    }
}
const mutations = {
    SET_TOKEN(state, token) {
        localStorage.setItem('token', token)
        state.token = token
        if (token) {
            state.isUserLoggedIn = true
        } else {
            state.isUserLoggedIn = false
        }
    },
    SET_USER_DATA(state, data) {
        localStorage.setItem('user', JSON.stringify(data))
        state.user = data
    },
    CLEAR_AUTH(state) {
        state.token = null
        state.user = null
        state.isUserLoggedIn = false
        state.address = null
        localStorage.clear()
    },
    SET_ADDRESS(state, address) {
        localStorage.setItem('address', address)
        state.address = address
    }
}

const actions = {
    async signIn({ commit, state}) {
        if (!state.address){
            var address = await authAPI.connectWallet();
            commit('SET_ADDRESS', address);
        }
        
        try{
            var message = await authAPI.getSignMessage(state.address);
            var signResult = await authAPI.signInWithEthereum(message);
            var data = signResult.data;
            if (data.code == 0) {
                var token = signResult.headers.token;
                commit('SET_TOKEN', token)
                commit('SET_USER_DATA', data.user)
                commit('SET_ADDRESS', data.user.address)

            }
        }catch(e){
            console.log(data)
        }
        
        
        
    },
}

export default {
  state,
  getters,
  mutations,
  actions
}