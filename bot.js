const Discord = require("discord.io");
const auth = require("./auth.json");
const axios = require("axios");
const fetch = require("node-fetch");
var randomWords = require("random-words");

const bot = new Discord.Client({
  token: auth.token,

  autorun: true,
});

bot.on("ready", () => {
  console.log("bot logged in");
});

//Functionality
bot.on("message", function (user, userID, channelID, message, evt) {
  if (message.substring(0, 1) == "^") {
    var args = message.substring(1).split(" ");
    var cmd = args[0];
    args = args.splice(1);

    var word = [];
    var data = [];

    switch (cmd) {
      case "ping":
        bot.sendMessage({
          to: channelID,
          message: "Pong!",
        });
        break;

      case "testAPI":
        //Generate random word variable for rhyming API and sendMessage
        // fetch("https://random-words-api.vercel.app/word")
        //   .then((res) => res.json())
        //   .then((json) => {
        //     let someJson = JSON.stringify(json)
        //       .split(":")[1]
        //       .split(",")[0]
        //       .replace(/["]+/g, "");
        //     console.log(someJson);
        var flag = true;
        while (flag == true) {
          word = randomWords(1);
          //Uses random word variable to get rhyming words from API
          fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
            .then((res) => res.json())
            .then((json) => {
              let rhymeJson = JSON.stringify(json);
              if (rhymeJson.charAt(1) != "]") {
                rhymeJson = JSON.parse(rhymeJson);

                for (let i = 0; i < rhymeJson.length; i++) {
                  data.push(rhymeJson[i].word);
                  
                }
                console.log(data[0]);

                bot.sendMessage({
                  to: channelID,
                  message: `What rhymes with the word: ${word}`,
                });
                flag = false;
              } else {
                console.error("Error - API gave word with no rhyme DB");
              }
            });

          break;
        }
    }
  }
});
