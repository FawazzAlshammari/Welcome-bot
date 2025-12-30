require("dotenv").config();
const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // مهم جداً للترحيب
  ],
});

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID; // حطه بالـ .env
const BG_PATH = "./welcome.png"; // نفس مسار الصورة عندك في المشروع

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  try {
    // قناة الترحيب
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!channel) return;

    // Canvas
    const canvas = createCanvas(1280, 400);
    const ctx = canvas.getContext("2d");

    // Background
    const bg = await loadImage(BG_PATH);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Avatar settings (عدّلها براحتك)
    const avatarSize = 180;
    const avatarX = 290;
    const avatarY = 240;

    // Clip circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Load avatar
    const avatarURL = member.user.displayAvatarURL({ extension: "png", size: 512 });
    const avatar = await loadImage(avatarURL);

    // Draw avatar
    ctx.drawImage(
      avatar,
      avatarX - avatarSize / 2,
      avatarY - avatarSize / 2,
      avatarSize,
      avatarSize
    );
    ctx.restore();

    // Send
    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "welcome.png",
    });

    await channel.send({ files: [attachment] });
  } catch (err) {
    console.error("❌ Welcome error:", err);
  }
});

client.login(process.env.TOKEN);
