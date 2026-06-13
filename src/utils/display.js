/**
 * 终端美化输出工具
 */

import process from 'process';

// ANSI 颜色
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
};

/**
 * 去除 ANSI 转义序列
 */
function stripAnsi(str) {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * 计算字符串的显示宽度（忽略 ANSI，中文占2列）
 */
function displayWidth(str) {
    let w = 0;
    for (const ch of stripAnsi(str)) w += ch.charCodeAt(0) > 127 ? 2 : 1;
    return w;
}

/**
 * 获取内容区宽度（终端宽度 - 边框和缩进）
 */
function contentWidth() {
    return (process.stdout.columns || 80) - 6;
}

/**
 * 文本按 maxWidth 折行（中英混排，URL 不折行）
 */
export function wrapText(text, maxWidth) {
    const lines = [];
    for (const paragraph of text.split('\n')) {
        const parts = paragraph.split(/(https?:\/\/\S+)/g);
        let line = '';
        let width = 0;

        for (const part of parts) {
            if (/^https?:\/\//.test(part)) {
                if (width > 0) { lines.push(line); line = ''; width = 0; }
                lines.push(part);
            } else {
                for (const char of part) {
                    width += char.charCodeAt(0) > 127 ? 2 : 1;
                    line += char;
                    if (width >= maxWidth) { lines.push(line); line = ''; width = 0; }
                }
            }
        }
        if (line) lines.push(line);
    }
    return lines;
}

/**
 * 输出消息列表（带边框卡片）
 */
export function renderList(items, mapper) {
    if (!items?.length) {
        console.log(`${C.dim}  暂无内容${C.reset}`);
        return;
    }

    const cw = contentWidth();
    const hLine = '─'.repeat(cw);

    items.forEach((item, i) => {
        const { title, time, body } = mapper(item);
        if (i > 0) console.log();

        // 边框
        console.log(`  ${C.dim}┌${hLine}┐${C.reset}`);

        // 标题行
        const titleRaw = ` ${title}  ${time}`;
        const titleStyled = ` ${C.cyan}${C.bold}${title}${C.reset}  ${C.gray}${time}${C.reset}`;
        const pad = ' '.repeat(Math.max(0, cw - displayWidth(titleRaw)));
        console.log(`  ${C.dim}│${C.reset}${titleStyled}${pad}${C.dim}│${C.reset}`);

        // 分隔线
        console.log(`  ${C.dim}├${hLine}┤${C.reset}`);

        // 内容
        const wrapped = wrapText(body, cw - 2);
        for (const line of wrapped) {
            const dw = displayWidth(line);
            if (dw <= cw - 2) {
                console.log(`  ${C.dim}│${C.reset} ${line}${' '.repeat(cw - 2 - dw)} ${C.dim}│${C.reset}`);
            } else {
                console.log(`  ${C.dim}│${C.reset} ${line}`);
            }
        }

        console.log(`  ${C.dim}└${hLine}┘${C.reset}`);
    });

    console.log();
    console.log(`${C.dim}  共 ${items.length} 条${C.reset}`);
}

/**
 * 输出新闻列表
 */
export function renderNewsList(items, mapper) {
    if (!items?.length) {
        console.log(`${C.dim}  暂无内容${C.reset}`);
        return;
    }

    const padLen = String(items.length).length;

    items.forEach((item, i) => {
        const { title, tag, time, url } = mapper(item);
        if (i > 0) console.log();

        const idx = String(i + 1).padStart(padLen);
        const indent = ' '.repeat(padLen + 2);

        console.log(`  ${C.cyan}${C.bold}${idx}.${C.reset} ${C.bold}${title}${C.reset}`);
        console.log(`${indent}${C.yellow}${tag}${C.reset} ${C.gray}·${C.reset} ${C.dim}${time}${C.reset}`);
        console.log(`${indent}${C.blue}${C.dim}${url}${C.reset}`);
    });

    console.log();
    console.log(`${C.dim}  共 ${items.length} 条${C.reset}`);
}
