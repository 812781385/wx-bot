import express from 'express';
import { port } from './config/config.mjs'
import WXBot from './src/bot.mjs'

// 创建Express应用程序
const app = express();

app.listen(port, async () => {
  new WXBot();
});