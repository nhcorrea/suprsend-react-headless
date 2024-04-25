import axios from 'axios';

const API_URL = 'https://inboxs.live';
const COLLECTOR_API_URL = 'https://hub.suprsend.com';

export const httpClient = axios.create({
  baseURL: API_URL,
});

export const httpClientCollector = axios.create({
  baseURL: COLLECTOR_API_URL,
});
