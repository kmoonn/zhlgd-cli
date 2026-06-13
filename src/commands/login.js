import axios from 'axios';
import { prompt } from '../utils/prompt.js';
import { rsaEncrypt } from '../utils/rsa.js';
import { saveCookies, cookieHeader, collectCookies } from '../utils/session.js';
import { BASE_URL, UA } from '../utils/config.js';

const RSA_URL = `${BASE_URL}/tpass/rsa?skipWechat=true`;
const LOGIN_URL = `${BASE_URL}/tpass/login`;
const SERVICE = `${BASE_URL}/tp_up_new/`;

const UA_JSON = JSON.stringify({
    ua: UA,
    browser: { name: 'Chrome', version: '148.0.0.0', major: '148' },
    cpu: {},
    device: { model: 'Macintosh', vendor: 'Apple' },
    engine: { name: 'Blink', version: '148.0.0.0' },
    os: { name: 'macOS', version: '10.15.7' },
});

function extractHiddenFields(html) {
    const lt = html.match(/name="lt" value="(.*?)"/)?.[1];
    const execution = html.match(/name="execution" value="(.*?)"/)?.[1];
    if (!lt || !execution) throw new Error('无法从登录页提取隐藏字段');
    return { lt, execution };
}

function extractTicket(redirectUrl) {
    const ticket = new URL(redirectUrl).searchParams.get('ticket');
    if (!ticket) throw new Error('重定向 URL 中未找到 ticket');
    return ticket;
}

async function followRedirects(url, cookieJar, headers, maxHops = 10) {
    let currentUrl = url;
    for (let i = 0; i < maxHops; i++) {
        const resp = await axios.get(currentUrl, {
            headers: { ...headers, Cookie: cookieHeader(cookieJar) },
            maxRedirects: 0,
            validateStatus: () => true,
        });
        collectCookies(resp.headers['set-cookie'], cookieJar);
        if (resp.status >= 300 && resp.status < 400 && resp.headers.location) {
            currentUrl = new URL(resp.headers.location, currentUrl).href;
            continue;
        }
        return resp;
    }
    throw new Error('重定向次数过多');
}

export default (program) => {
    program
        .command('login')
        .description('校园网登录')
        .option('-u, --username <account>', '学号')
        .option('-p, --password <pwd>', '密码')
        .action(async (options) => {
            const username = options.username || await prompt('请输入学号：');
            const password = options.password || await prompt('请输入密码：', true);

            const cookieJar = {};
            const commonHeaders = {
                'User-Agent': UA,
                'Referer': `${LOGIN_URL}?service=${SERVICE}`,
                'Origin': BASE_URL,
            };

            try {
                // 1. 获取 RSA 公钥
                const rsaResp = await axios.post(RSA_URL, null, {
                    headers: { ...commonHeaders, Cookie: cookieHeader(cookieJar) },
                    maxRedirects: 0, validateStatus: () => true,
                });
                collectCookies(rsaResp.headers['set-cookie'], cookieJar);

                // 2. RSA 加密
                const ul = rsaEncrypt(username, rsaResp.data.publicKey);
                const pl = rsaEncrypt(password, rsaResp.data.publicKey);

                // 3. 获取 lt、execution
                const loginPageResp = await axios.get(`${LOGIN_URL}?service=${SERVICE}`, {
                    headers: { ...commonHeaders, Cookie: cookieHeader(cookieJar) },
                    maxRedirects: 0, validateStatus: () => true,
                });
                collectCookies(loginPageResp.headers['set-cookie'], cookieJar);
                const { lt, execution } = extractHiddenFields(loginPageResp.data);

                // 4. 提交登录
                const loginResp = await axios.post(
                    LOGIN_URL,
                    new URLSearchParams({
                        ua: UA_JSON, visitorId: 'bc2f5efc890459a98f7cf9a753e6e6d1',
                        rsa: '', ul, pl, lt, execution, _eventId: 'submit',
                    }).toString(),
                    {
                        params: { service: SERVICE },
                        headers: { ...commonHeaders, Cookie: cookieHeader(cookieJar), 'Content-Type': 'application/x-www-form-urlencoded' },
                        maxRedirects: 0, validateStatus: () => true,
                    },
                );
                collectCookies(loginResp.headers['set-cookie'], cookieJar);

                if (loginResp.status !== 302) {
                    console.log('❌ 登录失败');
                    return;
                }

                // 5. 用 ST 换取完整 Cookie
                const st = extractTicket(loginResp.headers.location);
                await followRedirects(`${SERVICE}?ticket=${st}`, cookieJar, commonHeaders);

                // 6. 保存
                saveCookies(cookieJar);
                console.log('✅ 登录成功');

            } catch (err) {
                console.log('❌ 登录失败：', err.message);
            }
        });
};
