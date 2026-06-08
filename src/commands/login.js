import axios from 'axios';
import { prompt } from '../utils/prompt.js';

export default (program) => {
    program
        .command('login')
        .description('校园网登录')
        .option('-u, --username <account>', '学号')
        .option('-p, --password <pwd>', '密码')
        .action(async (options) => {
            console.log('📶 智慧理工大校园网登录\n');

            let username = options.username || await prompt('请输入学号：');
            let password = options.password || await prompt('请输入密码：');

            console.log('\n🔐 正在登录...');

            try {
                await axios.post('http://10.0.0.1/login', {
                    username, password
                });
                console.log('✅ 登录成功！');
            } catch (err) {
                console.log('❌ 登录失败：', err.message);
            }
        });
};