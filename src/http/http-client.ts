import axios, { AxiosRequestConfig } from 'axios';

const axiosHttpClient = axios.create();
axiosHttpClient.interceptors.request.use(config => {
    // Do something before request is sent
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

export const httpClient = {
    get<T>(url: string, config?: AxiosRequestConfig) {
        return axiosHttpClient.get<T>(url, config);
    }
};
