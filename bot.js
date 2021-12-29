const Discord = require("discord.io");
const auth = require("./auth.json");
const axios = require("axios");
const fetch = require("node-fetch");
var randomWords = require("random-words");
const { Intents } = require("discord.js");

const bot = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  token: auth.token,
  autorun: true,
});

bot.on("ready", () => {
  console.log("EzRhyme Bot is online");
});

//Functionality
bot.on("message", function (user, userID, channelID, message, evt) {
  if (message.substring(0, 1) == "^") {
    var args = message.substring(1).split(" ");
    var cmd = args[0];
    args = args.splice(1);

    var word = [];
    var rData = [];

    switch (cmd) {
      case "ping":
        bot.sendMessage({
          to: channelID,
          message: "Pong!",
        });
        break;

      case "rhyme":
        var flag = true;
        while (flag === true) {
          word = randomWords(1);
          //Uses random word variable to get rhyming words from API
          fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
            .then((res) => res.json())
            .then((json) => {
              let rhymeJson = JSON.stringify(json);
              if (rhymeJson.charAt(1) != "]") {
                rhymeJson = JSON.parse(rhymeJson);
                for (let i = 0; i < rhymeJson.length; i++) {
                  rData.push(rhymeJson[i].word);
                }
                bot.sendMessage({
                  to: channelID,
                  message: `What rhymes with the word ${word}?`,
                });
                //Bot listens to messages in channel
                bot.on(
                  "message",
                  function (user, userID, channelID, message, rawEvent) {
                    for (let j = 1; j < rData.length; j++) {
                      console.log(rData[j]);
                      if (message === rData[j]) {
                        bot.sendMessage({
                          to: channelID,
                          message: "Correct",
                        });
                      }
                    }
                  }
                );
              } else {
                console.error("Error - API gave word with no rhyme DB");
              }
            });
          break;
        }
    }
  }
});
