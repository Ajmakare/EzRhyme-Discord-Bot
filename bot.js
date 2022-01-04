const Discord = require("discord.io");
const auth = require("./auth.json");
const axios = require("axios");
const fetch = require("node-fetch");
var randomWords = require("random-words");
var rData = [];
var word = [];
var check;
var counter;
var flag = true;
var maxCounter = 10;

//Creating bot with token
const bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});

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

    //Necassary variable initializations for main "rhyme" case
    //var word = [];

    //Simple about the bot command
    if (cmd === "about") {
      bot.sendMessage({
        to: channelID,
        message:
          "A fun, rhyming game bot! Work amongst your Discord friends to come up words that rhyme with a randomly generated word! \n**Author:** @Ezrue#4297 on Discord \n**Github:** github.com/Ajmakare/DiscordRhymeBot",
      });
      return;
    } else if (cmd === "reset") {
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
    } else if (cmd === "rhyme") {
      /*Main bot functionality/concept:
       *see README*
       */
      //Generates a random word and uses that word to retrieve the rhyming JSON from the datamuse API
      //It then fills an array, rData, with all the words in the JSON that rhyme with the random word generated
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
            check = fillJsonArray(rhymeJson, rData); //Helper function defined below
            console.log(check);

            counter = rData.length;
            if (counter >= 30) {
              console.log(check);
              initialMessage(channelID, word, counter, check, maxCounter); //Helper function defined below
              //Bot listens to messages in channel and announces if a word has been said that rhymes with the generated word
              //while (maxCounter > -1) {
              bot.on(
                "message",
                (user, userID, channelID, message2, rawEvent) => {
                  if (maxCounter != 0) {
                    for (let j = 1; j < rData.length; j++) {
                      //console.log(rData[j]);
                      if (message2 != "^rhyme") {
                        if (message2 === rData[j]) {
                          rData = rData.filter((e) => e !== message2);
                          counter--;
                          maxCounter--;
                          if (maxCounter == 0) {
                            finalMessage(channelID, word); //Helper function defined below
                            rData = [];
                            flag = true;
                            maxCounter = 10;
                            return;
                          }
                          followUpMessage(
                            channelID,
                            message2,
                            word,
                            maxCounter,
                            counter
                          ); //Helper function defined below
                        }
                      }
                    }
                  }
                }
              );
              //}
            }
          } else {
            console.error("Error - API gave word with no rhyme DB");
          }
        });
    }
  }
});
//HELPER FUNCTIONS

//Function to fill an array with JSON data (in this case, word (the words that rhyme with the random generated word))
function fillJsonArray(json, arr) {
  if (arr.length === 0) {
    for (let i = 0; i < json.length; i++) {
      let temp = json[i].word;
      if (temp.includes(" ") == false) {
        arr.push(json[i].word);
      }
    }
    return true;
  }
  return false;
}

//Basic helper function for first message bot sends on ^rhyme command
async function initialMessage(channelID, word, counter, check, maxCounter) {
  if (check) {
    bot.sendMessage({
      to: channelID,
      message:
        `:wave: Name 10 words that rhyme with **${word}**! :point_right: Possible words: **` +
        counter +
        "**!",
    });
  } else {
    bot.sendMessage({
      to: channelID,
      message:
        `:face_with_monocle: The current word to rhyme with is: **${word}**! *` +
        maxCounter +
        ` more!*`,
    });
  }
}

//Basic helper function for follow up message bot sends after a correct word is listened to
function followUpMessage(channelID, message, word, maxCounter, counter) {
  bot.sendMessage({
    to: channelID,
    message:
      "☑️ **" +
      message +
      `** rhymes with the word **${word}!** *` +
      maxCounter +
      " more!* :point_right: Possible words: **" +
      counter +
      "**!",
  });
}

//Basic helper function for final bot sends when word has been rhymed 10 times
function finalMessage(channelID, word) {
  bot.sendMessage({
    to: channelID,
    message: `:astonished: You rhymed **${word}** with 10 words! :smile:`,
  });
}
