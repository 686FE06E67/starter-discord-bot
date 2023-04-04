// const { clientId, guildId, token, publicKey } = require('./config.json');
require("dotenv").config();
const express = require('express');

const { Client, GatewayIntentBits } = require("discord.js");
const cleverbot = require("cleverbot-free");

const APPLICATION_ID = process.env.APPLICATION_ID;
const TOKEN = process.env.TOKEN;
const PUBLIC_KEY = process.env.PUBLIC_KEY; //|| 'not set'
const GUILD_ID = process.env.GUILD_ID;

let coversation = [];

const app = express();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content.trim().startsWith("!")) {
    let userText = msg.content.substring(1);
    // msg.channel.sendTyping();
    console.log(userText);
  }
  if (msg.mentions.has(client.user.id)) {
    let txt = msg.content.substring(msg.content.indexOf('>')+2,msg.content.length);
    cleverbot(txt, coversation).then( res =>{
      coversation.push(txt);
      coversation.push(res);
      msg.channel.send(res);
    })
    msg.channel.sendTyping();
  }
});

client.on("interactionCreate", (inter) => {
  console.log(inter.appPermissions);
});

client.login(TOKEN);

app.get('/',(_req,res)=>{
  res.status(200).json('Bot now online');
})

app.listen(3000,()=>{
  console.log('Port 3000');
})