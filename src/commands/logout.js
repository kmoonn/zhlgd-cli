import { isLoggedIn, clearCookies } from '../utils/session.js';

export default (program) => {
    program
        .command('logout')
        .description('退出登录')
        .action(() => {
            if (!isLoggedIn()) {
                console.log('⚠️  当前未登录');
                return;
            }
            clearCookies();
            console.log('✅ 已退出登录');
        });
};
