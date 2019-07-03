import axios from 'axios'
import config from './Config'

const api = axios.create({
    baseURL: config.url.API,
    withCredentials: true,
    xsrfCookieName: 'csrf_access_token',
    xsrfHeaderName: 'X-CSRF-TOKEN'
});

export default api