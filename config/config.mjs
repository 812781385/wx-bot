const port = 3000;
const botName = 'ding-dong-bot';
const welcomeMessage = `您好! 欢迎使用微信机器人\n请扫描二维码完成登录，开始您的机器人之旅！`;
const boxenOptions = {
  padding: 0.5,
  borderColor: "cyan",
  borderStyle: "round"
};

/*** 
 * ai聊天配置，参考以下教程
 * 源码：https://github.com/812781385/ollama-webUI
 * csdn教程：https://blog.csdn.net/qq_40279232/article/details/138618666?spm=1001.2014.3001.5502
 * */
const chatAiConfig = {
  url: 'http://127.0.0.1:11434/api/chat',
  model: 'qwen:32b',
}

export {
  port,
  botName,
  boxenOptions,
  welcomeMessage,
  chatAiConfig,
}