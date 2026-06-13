#!/usr/bin/env node

import { Command } from 'commander';
import loginCommand from '../src/commands/login.js';
import logoutCommand from '../src/commands/logout.js';
import whoamiCommand from '../src/commands/whoami.js';
import msgCommand from '../src/commands/msg.js';
import newsCommand from '../src/commands/news.js';

const program = new Command();

program
    .name('zhlgd')
    .version('1.0.0', '-v, --version')
    .description('智慧理工大 CLI 工具');

loginCommand(program);
logoutCommand(program);
whoamiCommand(program);
msgCommand(program);
newsCommand(program);

program.parse();
