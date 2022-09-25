import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api'
})

export const login = (payload) => api.post(`/login/`, payload)
export const register = (payload) => api.post(`/register/`, payload)
export const logout = () => api.get(`/logout`)

export const postThread = (payload) => api.post(`/postthread`, payload)
export const postComment = (payload) => api.post(`/postcomment`, payload)
export const getCookThreadList = (page) => api.get(`/getcookthreadlist/${page}`)
export const getEatThreadList = (page) => api.get(`/geteatthreadlist/${page}`)
export const getThread = () => api.get(`/getthread/`)
export const searchCookThreadList = (page) => api.get(`/searchcookthreadlist/${page}`)
export const searchEatThreadList = (page) => api.get(`/searcheatthreadlist/${page}`)

const apis = {
    login,
    register,
    logout,


    postThread,
    postComment,
    getCookThreadList,
    getEatThreadList,
    getThread,
    searchCookThreadList,
    searchEatThreadList
}

export default apis;