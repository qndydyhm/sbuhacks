import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api'
})

export const login = (payload) => api.post(`/login/`, payload)
export const register = (payload) => api.post(`/register/`, payload)

const apis = {
    login,
    register,

}

export default apis;