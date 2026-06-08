#!/usr/bin/env node

// 导入 commander 库，用于处理命令行
import { Command } from 'commander';
import loginCommand from '../src/commands/login.js';

const program = new Command();

// 配置 CLI 基础信息
program
    .name('zhlgd')          // 命令名称
    .version('1.0.0', '-v, --version')  // 版本号
    .description('一个基于 Node.js 开发的智慧理工大 CLI 工具');  // 描述

// 注册所有命令
loginCommand(program);

// 解析命令行输入的参数
program.parse();
