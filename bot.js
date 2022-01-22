var Discord = require("discord.io");
const axios = require("axios");
const fetch = require("node-fetch");
var randomWords = require("random-words");
require("dotenv").config();
var Game = require('./game');

//Creating bot with token
var bot = new Discord.Client({
  token: process.env.BOTTOKEN,
  autorun: true,
});
bot.setMaxListeners(50);

//Logging to console when bot is online
bot.on("ready", () => {
  console.log("EzRhyme Bot is online");
});

//Functionality
bot.on("message", (user, userID, channelID, message, evt) => {
  //Command prefix created
  if (message.substring(0, 1) == "^") {
    var args = message.substring(1).split(" ");
    var cmd = args[0];
    args = args.splice(1);

    //Simple about the bot command
    if (cmd === "about") {
      bot.sendMessage({
        to: channelID,
        message:
          "A fun, rhyming game bot! Work amongst your Discord friends to come up words that rhyme with a randomly generated word! \n**Author:** @Ezrue#4297 on Discord \n**Github:** github.com/Ajmakare/DiscordRhymeBot",
      });
      return;
    }

    if (cmd === "reset") {
      delete newGame;
      bot.sendMessage({
        to: channelID,
        message:
          ":grimacing: **" +
          user +
          "** reset the game. Do ^rhyme to start a new one! :hugging:",
      });
      return;
    }

    if (cmd === "rhyme") {
      /*Main bot functionality/concept:
       *see README*
       */
      //Generates a random word and uses that word to retrieve the rhyming JSON from the datamuse API
      //It then fills an array, rData, with all the words in the JSON that rhyme with the random word generated

      var newGame = new Game();
      if (newGame.flag) {
        newGame.word = randomWords(1);
        newGame.flag = false;
      }
      fetch(`https://api.datamuse.com/words?rel_rhy=${newGame.word}`)
        .then((res) => res.json())
        .then((json) => {
          let rhymeJson = JSON.stringify(json);
          if (rhymeJson.charAt(1) != "]") {
            rhymeJson = JSON.parse(rhymeJson);
            newGame.check = newGame.fillJsonArray(rhymeJson, newGame.rData); //Helper function defined below
            newGame.counter = newGame.rData.length;
            if (newGame.counter >= 10) {
              newGame.initialMessage(channelID, newGame.word, newGame.counter, newGame.check, newGame.maxCounter,bot); //Helper function defined below
              //Bot listens to messages in channel and announces if a word has been said that rhymes with the generated word
              bot.on(
                "message",
                (user, userID, channelID, message2, rawEvent) => {
                  if (newGame.maxCounter != 0) {
                    for (let j = 1; j < newGame.rData.length; j++) {
                      //console.log(rData[j]);
                      if (message2 != "^rhyme") {
                        if (message2 === newGame.rData[j]) {
                          newGame.rData = newGame.rData.filter((e) => e !== message2);
                          newGame.counter--;
                          newGame.maxCounter--;
                          if (newGame.maxCounter == 0) {
                            newGame.finalMessage(channelID, message2, newGame.word, bot); //Helper function defined below
                            newGame.rData = [];
                            newGame.flag = true;
                            newGame.check = undefined;
                            newGame.maxCounter = 10;
                            return;
                          }
                          newGame.followUpMessage(
                            channelID,
                            message2,
                            newGame.word,
                            newGame.maxCounter,
                            newGame.counter,
                            bot
                          ); //Helper function defined below
                        }
                      }
                    }
                  }
                }
              );
            } else {
              console.error("Counter error");
              newGame.rData = [];
              newGame.flag = true;
              newGame.check = undefined;
              newGame.maxCounter = 10;
            }
          } else {
            console.error("Invalid word error");
            newGame.flag = true;
          }
        });
    }
  }
});