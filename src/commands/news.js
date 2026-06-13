import { apiRequest, formatDate } from '../utils/api.js';
import { BASE_URL } from '../utils/config.js';
import { renderNewsList } from '../utils/display.js';

export default (program) => {
    program
        .command('news')
        .description('查看校园新闻')
        .action(async () => {
            try {
                const data = await apiRequest(
                    `${BASE_URL}/tp_up_new/up/newhome/getNewsNotice`,
                    { channel: '13962' },
                );

                renderNewsList(data, (item) => ({
                    title: item.PIM_TITLE,
                    tag: item.CHNLDESC,
                    time: formatDate(item.OPT_DATE),
                    url: item.URL,
                }));

            } catch (err) {
                console.log('❌', err.response?.status === 401 ? '登录已过期，请重新执行 zhlgd login' : err.message);
            }
        });
};
