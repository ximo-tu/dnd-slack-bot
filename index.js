require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/dnd-help", async ({ ack, respond}) => {
  await ack();
  await respond({
    text: "🎲 *DnD Bot Help Menu* 🎲\nHere is what I can do:\n• `/dnd-ping` / `/dnd-pong` - Check latency\n• `/d20` or `/dnd-d20` - Roll a 20-sided die!"
  });
});

app.command("/dnd-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nI'm the DnD bot!\nLatency: ${latency}ms` });
});

app.command("/dnd-pong", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Ping!\nI'm the DnD bot!\nLatency: ${latency}ms` });
});

const rollD20 = () => {
  return Math.floor(Math.random() * 20) + 1;
}

const handleD20Command = async ({ command, ack, respond}) => {
  await ack();
  const roll = rollD20();
  
  let modifierText = "";

  if (roll === 20) {
    modifierText = " ✨ *CRITICAL HIT* ✨";
  } else if (roll === 1) {
    modifierText = " 💀 *CRITICAL FAILURE!* 💀";
  }

  await respond({
    text: `<@${command.user_id}> rolled a *d20* and got: 🎲 *${roll}*${modifierText}`,
    response_type: "in_channel"
  })
}

app.command("/d20", handleD20Command);
app.command("/dnd-d20", handleD20Command);

(async () => {
  await app.start();
  console.log("DnD bot is running!");
})();
