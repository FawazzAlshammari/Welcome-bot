require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  AttachmentBuilder
} = require("discord.js");

const { createCanvas, loadImage } = require("canvas");

// ====== لازم يتعرّف client قبل client.on ======
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers // مهم عشان حدث دخول عضو
  ],
  partials: [Partials.User, Partials.GuildMember]
});

// ====== إعدادات الصورة ======
const BG_PATH = "./welcome.png"; // نفس اسم ملف الخلفية عندك
const AVATAR_SIZE = 170;         // حجم دائرة صورة العضو
const AVATAR_X = 155;            // مكانها (عدّل لو تبي)
const AVATAR_Y = 105;            // مكانها (عدّل لو تبي)

async function makeWelcomeImage(member) {
  const bg = await loadImage(BG_PATH);

  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");

  // خلفية
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // صورة العضو (avatar)
  const avatarURL = member.user.displayAvatarURL({
    extension: "png",
    size: 512
  });
  const avatar = await loadImage(avatarURL);

  // قص دائرة
  ctx.save();
  ctx.beginPath();
  ctx.arc(AVATAR_X, AVATAR_Y, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // رسم صورة العضو داخل الدائرة
  ctx.drawImage(
    avatar,
    AVATAR_X - AVATAR_SIZE / 2,
    AVATAR_Y - AVATAR_SIZE / 2,
    AVATAR_SIZE,
    AVATAR_SIZE
  );

  ctx.restore();

  return canvas.toBuffer("image/png");
}

// ====== حدث دخول عضو ======
client.on("guildMemberAdd", async (member) => {
  try {
    const channelId = process.env.WELCOME_CHANNEL_ID;
    if (!channelId) return;

    const ch = await client.channels.fetch(channelId).catch(() => null);
    if (!ch) return;

    const imgBuffer = await makeWelcomeImage(member);
    const attachment = new AttachmentBuilder(imgBuffer, { name: "welcome.png" });

    await ch.send({
      content: `ارحب يا ${member} 🔥`,
      files: [attachment]
    });
  } catch (err) {
    console.log("Welcome Error:", err);
  }
});

// ====== تسجيل دخول ======
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
