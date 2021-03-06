/**
 * Author: Aidan Makare
 * Brief: A fun, discord bot project that implements a rhyming game to play amongst friends in a discord server.
 */

var Discord = require("discord.io");
const axios = require("axios");
const fetch = require("node-fetch");
var randomWords = require("random-words");
require("dotenv").config();
const {
  fillJsonArray,
  initialMessage,
  followUpMessage,
  finalMessage,
} = require("./functions");

//Necassary variables for game - will eventually be a Game class as seen in test branch for when this bot is (if ever) publicized.
var rData = [];
var word = [];
var check;
var counter;
var flag = true;
var maxCounter = 10;

//Creating bot with token
var bot = new Discord.Client({
  token: process.env.BOTTOKEN,
  autorun: true,
});
bot.setMaxListeners(0);

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

    //Reset current game if word is too difficult, or if for some reason the bot is to break.
    if (cmd === "reset") {
      rData = [];
      flag = true;
      check = undefined;
      maxCounter = 10;
      bot.sendMessage({
        to: channelID,
        message:
          ":grimacing: **" +
          user +
          "** reset the game. Do ^rhyme to start a new one! :hugging:",
      });
      return;
    }

    /*Main bot functionality/concept:
     *see README*
     */
    //Generates a random word and uses that word to retrieve the rhyming JSON from the datamuse API
    //It then fills an array, rData, with all the words in the JSON that rhyme with the random word generated
    if (cmd === "rhyme") {
      if (flag) {
        word = randomWords(1);
        flag = false;
      }
      fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
        .then((res) => res.json())
        .then((json) => {
          let rhymeJson = JSON.stringify(json);
          if (rhymeJson.charAt(1) != "]") {
            rhymeJson = JSON.parse(rhymeJson);
            check = fillJsonArray(rhymeJson, rData); //Helper function defined in functions.js
            counter = rData.length;
            if (counter >= 10) {
              initialMessage(channelID, word, counter, check, maxCounter, bot); //Helper function defined in functions.js
              //Bot listens to messages in channel and announces if a word has been said that rhymes with the generated word
              bot.on(
                "message",
                (user, userID, channelID, message2, rawEvent) => {
                  message2 = message2.toLowerCase();
                  if (maxCounter != 0) {
                    for (let j = 1; j < rData.length; j++) {
                      //console.log(rData[j]);
                      if (message2 != "^rhyme") {
                        if (message2 === rData[j]) {
                          rData = rData.filter((e) => e !== message2);
                          counter--;
                          maxCounter--;
                          if (maxCounter == 0) {
                            finalMessage(channelID, message2, word, bot); //Helper function defined in functions.js
                            rData = [];
                            flag = true;
                            check = undefined;
                            maxCounter = 10;
                            return;
                          }
                          followUpMessage(
                            channelID,
                            message2,
                            word,
                            maxCounter,
                            counter,
                            bot
                          ); //Helper function defined in functions.js
                        }
                      }
                    }
                  }
                }
              );
            } else {
              console.error("Counter error"); //Throws error if counter is for some reason off (more for my bug checking)
              rData = [];
              flag = true;
              check = undefined;
              maxCounter = 10;
            }
          } else {
            console.error("Invalid word error"); //Throws this error if random word module generates a word that the API doesn't contain.
            flag = true;
          }
        });
    }
  }
});
