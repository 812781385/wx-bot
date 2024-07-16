import axios from 'axios';
import { chatAiConfig } from '../config/config.mjs';

const messageHistory = [
  {role: "system", content: "你现在是我的微信好友，你的昵称是：小美。从现在开始你要用简单且幽默的文本与我们聊天，25字以内"}
];

export const chatApi = (message) => {
  return new Promise(async (resolve, reject) => {
    messageHistory.push({ role: 'user', content: message });

    const params = {
      stream: false,
      model: chatAiConfig.model,
      messages: messageHistory,
    }
    const response = await axios({
      url: chatAiConfig.url,
      data: params,
      method: 'POST',
    });

    const resMessage = response.data.message.content
    messageHistory.push(response.data.message)
    resolve(resMessage)
  })
}
