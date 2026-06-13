import * as readline from 'readline';

/**
 * 交互式命令行输入
 * @param {string} question - 提示文字
 * @param {boolean} [hidden=false] - 是否隐藏输入（用于密码）
 * @returns {Promise<string>}
 */
export function prompt(question, hidden = false) {
    // hidden 且在 TTY 终端下：用 rawMode 逐字符读取，不回显
    if (hidden && process.stdin.isTTY) {
        return new Promise((resolve) => {
            process.stdout.write(question);
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.setEncoding('utf8');

            let input = '';
            const onData = (char) => {
                switch (char) {
                    case '\n':
                    case '\r':
                    case '': // Ctrl+D
                        process.stdin.setRawMode(false);
                        process.stdin.pause();
                        process.stdin.removeListener('data', onData);
                        process.stdout.write('\n');
                        resolve(input);
                        break;
                    case '': // Ctrl+C
                        process.stdout.write('\n');
                        process.exit(1);
                        break;
                    case '': // 退格
                    case '\b':
                        input = input.slice(0, -1);
                        break;
                    default:
                        input += char;
                        break;
                }
            };
            process.stdin.on('data', onData);
        });
    }

    // 普通输入 或 非TTY管道输入：使用 readline
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
