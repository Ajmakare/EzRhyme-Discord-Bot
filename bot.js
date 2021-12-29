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

    var maxCounter = 10

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
          flag = false
          word = randomWords(1);
          //Uses random word variable to get rhyming words from API
          fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
            .then((res) => res.json())
            .then((json) => {
              let rhymeJson = JSON.stringify(json);
              if (rhymeJson.charAt(1) != "]") {
                rhymeJson = JSON.parse(rhymeJson);
                for (let i = 0; i < rhymeJson.length; i++) {
                  let temp = rhymeJson[i].word;
                  if (temp.includes(" ") == false) {
                    rData.push(rhymeJson[i].word);
                  }
                }
                var counter = rData.length;
                if (counter >= 10) {
                  bot.sendMessage({
                    to: channelID,
                    message:
                      `Name 10 words that rhyme with ${word}! \nPossible words: ` +
                      counter,
                  });
                  //Bot listens to messages in channel
                  bot.on(
                    "message",
                    function (user, userID, channelID, message, rawEvent) {
                      for (let j = 1; j < rData.length; j++) {
                        console.log(rData[j]);
                        if (message === rData[j]) {
                          counter--;
                          maxCounter--;
                          bot.sendMessage({
                            to: channelID,
                            message: "Correct \nPossible words: " + counter,
                          });
                          if(maxCounter == 0){
                            bot.sendMessage({
                              to: channelID,
                              message: `Good Job! You rhymed ${word} with 10 words! Try to keep going... or do ^rhyme for another!`,
                            });
                            break;
                          }
                        }
                      }
                    }
                  );
                }
              } else {
                flag=true;
                console.error("Error - API gave word with no rhyme DB");
              }
            });
          break;
        }
    }
  }
});
