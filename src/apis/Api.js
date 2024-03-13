import axios from 'axios'

export default () => {
    const token = localStorage.getItem('token')
    const axiosInstance = axios.create({
        baseURL: `${process.env.VUE_APP_URL}/api`,
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'token': `${token}`
        }
    })

    // const token = localStorage.getItem('token')
    // if (token) {
    //     axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
    // }

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                location.reload()
            }
            return Promise.reject(error)
        }
    )

    return axiosInstance
}