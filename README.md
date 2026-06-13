# zhlgd-cli

武汉理工大学智慧理工大命令行工具。

## 安装

```bash
npm install -g zhlgd
```

## 命令

| 命令 | 说明 |
|------|------|
| `zhlgd login` | 校园网登录（`-u` 学号 `-p` 密码，省略则交互输入） |
| `zhlgd msg` | 查看我的消息 |
| `zhlgd news` | 查看校园新闻 |
| `zhlgd whoami` | 查看登录状态 |
| `zhlgd logout` | 退出登录 |

登录后 Cookie 自动保存至 `~/.zhlgd/cookies.json`，其他命令自动鉴权。

## 贡献

欢迎 Issue 和 PR。

## License

[MIT](LICENSE)
