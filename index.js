require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// Helper function to roll any size die
const rollDie = (sides) => {
  return Math.floor(Math.random() * sides) + 1;
};

// Help Menu updated with the new dice
app.command("/dnd-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: "🎲 *DnD Bot Help Menu* 🎲\n" +
          "Here is what I can do:\n" +
          "• `/dnd-ping` / `/dnd-pong` - Check latency\n" +
          "• `/d4` or `/dnd-d4` - Roll a d4\n" +
          "• `/dnd-d6` - Roll a d6\n" +
          "• `/d8` or `/dnd-d8` - Roll a d8\n" +
          "• `/d10` or `/dnd-d10` - Roll a d10\n" +
          "• `/d12` or `/dnd-d12` - Roll a d12\n" +
          "• `/d20` or `/dnd-d20` - Roll a d20 (With Crit detection!)\n" +
          "• `/d100` or `/dnd-d100` - Roll a d100"
  });
});

// Latency checks
app.command("/dnd-ping", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nI'm the DnD bot!\nLatency: ${latency}ms` });
});

app.command("/dnd-pong", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Ping!\nI'm the DnD bot!\nLatency: ${latency}ms` });
});

// Generic dice roller handler
const handleDiceRoll = async ({ command, ack, respond }) => {
  await ack();
  
  // Extract the numbers from the command (e.g., "/dnd-d100" or "/d4" -> 100 or 4)
  const match = command.command.match(/d(\d+)/);
  if (!match) {
    await respond({ text: "Error determining dice type." });
    return;
  }
  
  const sides = parseInt(match[1], 10);
  const roll = rollDie(sides);
  let modifierText = "";

  // Keep the special critical formatting unique to the d20
  if (sides === 20) {
    if (roll === 20) {
      modifierText = " ✨ *CRITICAL HIT* ✨";
    } else if (roll === 1) {
      modifierText = " 💀 *CRITICAL FAILURE!* 💀";
    }
  }

  await respond({
    text: `<@${command.user_id}> rolled a *d${sides}* and got: 🎲 *${roll}*${modifierText}`,
    response_type: "in_channel"
  });
};

// Registering standard and prefixed commands
app.command("/d4", handleDiceRoll);
app.command("/dnd-d4", handleDiceRoll);

// /d6 is omitted, but /dnd-d6 is available
app.command("/dnd-d6", handleDiceRoll);

app.command("/d8", handleDiceRoll);
app.command("/dnd-d8", handleDiceRoll);

app.command("/d10", handleDiceRoll);
app.command("/dnd-d10", handleDiceRoll);

app.command("/d12", handleDiceRoll);
app.command("/dnd-d12", handleDiceRoll);

app.command("/d20", handleDiceRoll);
app.command("/dnd-d20", handleDiceRoll);

app.command("/d100", handleDiceRoll);
app.command("/dnd-d100", handleDiceRoll);

(async () => {
  await app.start();
  console.log("DnD bot is running!");
})();