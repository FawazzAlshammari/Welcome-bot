require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  AttachmentBuilder
} = require("discord.js");

const { createCanvas, loadImage } = require("canvas");

const canvas = createCanvas(1280, 400);
const ctx = canvas.getContext("2d");

// الخلفية
const bg = await loadImage("./welcome.png");
ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

// إعدادات صورة العضو
const avatarSize = 180; // حجم الدائرة
const avatarX = 260;    // مكانها عرضياً
const avatarY = 200;    // مكانها طولياً (نص الصورة)

// قص دائري
ctx.save();
ctx.beginPath();
ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
ctx.closePath();
ctx.clip();

// صورة العضو
const avatarURL = member.user.displayAvatarURL({
  extension: "png",
  size: 512,
});
const avatar = await loadImage(avatarURL);

// رسم الصورة داخل الدائرة
ctx.drawImage(
  avatar,
  avatarX - avatarSize / 2,
  avatarY - avatarSize / 2,
  avatarSize,
  avatarSize
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
