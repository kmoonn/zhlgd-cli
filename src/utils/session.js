import fs from 'fs';
import os from 'os';
import path from 'path';

const CONFIG_DIR = path.join(os.homedir(), '.zhlgd');
const COOKIE_FILE = path.join(CONFIG_DIR, 'cookies.json');

function ensureDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}

/**
 * 保存 Cookie 到本地文件
 */
export function saveCookies(cookieJar) {
    ensureDir();
    fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookieJar, null, 2), 'utf-8');
}

/**
 * 从本地文件读取 Cookie
 */
export function loadCookies() {
    try {
        if (!fs.existsSync(COOKIE_FILE)) return {};
        return JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf-8'));
    } catch {
        return {};
    }
}

/**
 * 清除本地 Cookie
 */
export function clearCookies() {
    try {
        if (fs.existsSync(COOKIE_FILE)) fs.unlinkSync(COOKIE_FILE);
    } catch { /* ignore */ }
}

/**
 * 是否已登录
 */
export function isLoggedIn() {
    return Object.keys(loadCookies()).length > 0;
}

/**
 * 将 cookie jar 拼成 Cookie 请求头
 */
export function cookieHeader(cookieJar) {
    return Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
}

/**
 * 从响应的 Set-Cookie 头收集 cookie 并更新 jar
 */
export function collectCookies(setCookieHeaders, cookieJar) {
    if (!setCookieHeaders) return;
    const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
    for (const raw of headers) {
        const [kv] = raw.split(';');
        const eqIdx = kv.indexOf('=');
        if (eqIdx > 0) {
            cookieJar[kv.substring(0, eqIdx).trim()] = kv.substring(eqIdx + 1).trim();
        }
    }
}
