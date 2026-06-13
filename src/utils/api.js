import axios from 'axios';
import { isLoggedIn, loadCookies, cookieHeader } from './session.js';
import { UA, API_HEADERS } from './config.js';

/**
 * 带鉴权的 API 请求，未登录时自动提示
 */
export async function apiRequest(url, body) {
    if (!isLoggedIn()) {
        console.log('⚠️  未登录，请先执行 zhlgd login');
        process.exit(1);
    }
    const cookies = loadCookies();
    const resp = await axios.post(url, body, {
        headers: {
            ...API_HEADERS,
            'cookie': cookieHeader(cookies),
            'User-Agent': UA,
        },
    });
    return resp.data;
}

/**
 * 格式化时间戳为日期字符串
 */
export function formatDate(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 格式化时间戳为日期时间字符串
 */
export function formatDateTime(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
