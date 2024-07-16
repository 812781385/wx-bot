
import { botName, boxenOptions, welcomeMessage } from '../config/config.mjs';
import { chatApi } from './chatAi.mjs';
import { ScanStatus, WechatyBuilder, log } from 'wechaty';
import qrcodeTerminal from  'qrcode-terminal';
import gradientString from 'gradient-string';
import boxen from 'boxen';

export default class WXBot extends WechatyBuilder {
  constructor() {
    super();
    this.init();
  }

  #botInstance;
  #welcomeMessage = gradientString("cyan", "magenta").multiline(welcomeMessage);
  #userInfo;

  init() {
    this.#creatBot();
  }

  async #creatBot() {
    this.#botInstance = super.build({
      name: botName,
      memory: './memory-card.json',
    });
    await this.#botInstance.start();
    this.#botInstance.on('scan', this.onScan.bind(this));
    this.#botInstance.on('login', this.onLogin.bind(this));
    this.#botInstance.on('logout', this.onLogout.bind(this));
    this.#botInstance.on('message', this.onMessage.bind(this));
    this.#botInstance.on('disconnected', this.onDisconnected.bind(this));
  }

  onScan (qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      qrcodeTerminal.generate(qrcode, { small: true });
      console.log(boxen(this.#welcomeMessage, boxenOptions));
    }
  }

  onLogin (user) {
    const userInfo = user.payload;
    const login = `欢迎【${userInfo.name}】登录，您的临时id为: ${userInfo.id}`
    const message = gradientString("cyan", "magenta").multiline(login);
    this.#userInfo = {
      name: userInfo.name,
      id: userInfo.id,
      address: userInfo.address,
      avatar: userInfo.avatar,
      city: userInfo.city,
      weixin: userInfo.weixin,
    };
    console.log(message);
  }

  onLogout (user) {
    log.info('StarterBot', '%s logout', user)
  }

  async onDisconnected () {
    console.log(`断了: ${error}`);
    await this.#botInstance.stop();
    await this.#botInstance.start();
  }

  async onMessage (msg) {
    const messageContent = msg.text().trim();
    if (!messageContent) { return }

    // 消息发送者
    const senderInfo = msg.talker();
    const senderInfoName = senderInfo.name();
    if (!senderInfo) { return }

    const room = msg.room();

    // 1.私聊被动回复
    if (!room) {
      const message = gradientString("green", "green").multiline(`【${senderInfoName}】对你说：${messageContent}`);
      console.log(message);
      this.passiveReply(msg, messageContent);
      return;
    }

    // 3.群聊被动回复
    const roomName = await room.topic();
    if (await msg.mentionSelf()) {
      const rexp = new RegExp(`@${this.#userInfo.name}`, "g");
      const roomMessageContent = messageContent.replace(rexp, "").trim();
      const message = gradientString("green", "green").multiline(`群「${roomName}」里，【${senderInfoName}】@你说：${roomMessageContent}`);
      console.log(message);
      if (roomMessageContent.length === 0) {
        msg.say(`@${senderInfoName} 你好，有什么可以帮助你的？`);
        return;
      }
      this.passiveReply(msg, roomMessageContent);
      return;
    }

    // 3.监听群里其他消息
    const message = gradientString("green", "green").multiline(`群「${roomName}」里，【${senderInfoName}】说：${messageContent}`);
    console.log(message);

  }

  /*
  * 所有的回复都会调用此函数
  * 消息类型：7:text 5:emoji 6:img 2:voice 15:video 1:file 3:card
  */
  async passiveReply(msg, messageContent) {
    if (msg.type() == 7) {
      const result = await chatApi(messageContent);
      msg.say(result);
      const message = gradientString("green", "green").multiline(`你回复说：${result}`);
      console.log(message);
    }
  }
}
