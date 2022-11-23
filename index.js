const { spawn } = require("child_process");
const dotenv = require("dotenv");

dotenv.config();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.API_KEY;
const adminId = process.env.ADMIN_ID;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  let messageId = 0;
  Promise.all([bot.sendMessage(chatId, `downloading`)]).then((results) => {
    messageId = results[0].message_id;
  });

  if (chatId === adminId) {
    const child = spawn(
      `D: & dir & cd Downloads\\yt & npx kkr -d "${resp}" --live`,
      {
        shell: true,
      }
    );

    child.stdout.on("data", (data) => {
      console.log(`child stdout: ${data}`);

      // bot.editMessageText(`${data}`, {
      //   chat_id: chatId,
      //   message_id: messageId,
      // });
    });

    child.stderr.on("data", (data) => {
      console.error(`child stderr: ${data}`);
    });

    console.log(resp);
    bot.sendMessage(chatId, resp);
  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.chat.username;
  console.log(chatId, userName, msg);

  if (chatId === adminId) {
    bot.sendMessage(chatId, `${userName}, send me '/echo text'`);
  }
});
