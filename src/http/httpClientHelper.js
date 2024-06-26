import axios from "axios";
import localStorageHelper from "../helpers/localStorageHelper";
import {AUTH_ROUTE} from "../resources/consts";

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT
});

const getConfig = () => {
    const token = localStorageHelper.getLocalToken();

    if (!token) {
        return {};
    }

    return { headers: { authorization: `Bearer ${token}` } };
}

const handleRequest = async (request, useConfig) => {
    const response = await request(useConfig ? getConfig() : {});
    const isUnauthorised = (response.status === 401 || response.data?.error_code === 401);

    if (isUnauthorised && !window.location.toString().includes(AUTH_ROUTE)) {
        localStorageHelper.deleteLocalToken();
        window.location.replace(AUTH_ROUTE);
    }

    return response;
}

const httpClientHelper = {
    async post(url, data, useConfig = true) {
        const request = (config = {}) => $host.post(url, { ...data }, config);
        const response = await handleRequest(request, useConfig);

        return response.data || {};
    },

    async get(url, useConfig = true) {
        const request = (config = {}) => $host.get(url, config);
        const response = await handleRequest(request, useConfig);

        return response.data || {};
    },

    async put(url, data, useConfig = true) {
        const request = (config = {}) => $host.put(url, { ...data }, config);
        const response = await handleRequest(request, useConfig);

        return response.data || {};
    },

    async upload(url, files = [], data = {}, useConfig = true) {
        const body = new FormData();

        Array.from(files).forEach(file => body.append(`files`, file));
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(data[key])) {
                Object.entries(data[key]).forEach(([, val]) => body.append(key, val));

                return;
            }

            body.append(key, value);
        });


        const request = (config = {}) => $host.post(url, body, config);
        const response = await handleRequest(request, useConfig);

        return response.data || {};
    }
}

export default httpClientHelper;