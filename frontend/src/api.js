import axios from "axios";

export const api = axios.create({
    baseURL: 'https://wallet-app-nest.onrender.com/api', // поменяй если нужно
    headers: {
        'Content-Type': 'application/json',
    },
});