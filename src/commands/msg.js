import { apiRequest, formatDateTime } from '../utils/api.js';
import { BASE_URL } from '../utils/config.js';

const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    gray: '\x1b[90m',
};

export default (program) => {
    program
        .command('msg')
        .description('查看我的消息')
        .action(async () => {
            try {
                const data = await apiRequest(
                    `${BASE_URL}/tp_up_new/up/newhome/getFpMsgList`,
                    { MSG_TYPE: '3' },
                );

                if (!data?.length) {
                    console.log(`${C.dim}  暂无消息${C.reset}`);
                    return;
                }

                const padLen = String(data.length).length;

                data.forEach((item, i) => {
                    if (i > 0) console.log();

                    const idx = String(i + 1).padStart(padLen);
                    const indent = ' '.repeat(padLen + 2);

                    // 序号 + 内容
                    console.log(`  ${C.cyan}${C.bold}${idx}.${C.reset} ${C.bold}${item.content.replace(/\n/g, ' ')}${C.reset}`);

                    // 来源 · 时间
                    console.log(`${indent}${C.yellow}${item.sysName}${C.reset} ${C.gray}·${C.reset} ${C.dim}${formatDateTime(item.sendTime)}${C.reset}`);
                });

                console.log();
                console.log(`${C.dim}  共 ${data.length} 条${C.reset}`);

            } catch (err) {
                console.log('❌', err.response?.status === 401 ? '登录已过期，请重新执行 zhlgd login' : err.message);
            }
        });
};
