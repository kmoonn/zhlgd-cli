import { isLoggedIn } from '../utils/session.js';

export default (program) => {
    program
        .command('whoami')
        .description('查看登录状态')
        .action(() => {
            if (!isLoggedIn()) {
                console.log('⚠️  未登录，请先执行 zhlgd login');
                return;
            }
            console.log('✅ 已登录');
        });
};
