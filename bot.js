const Discord = require("discord.io");
const auth = require("./auth.json");
const axios = require("axios");
const fetch = require("node-fetch");
var randomWords = require("random-words");
const { Intents } = require("discord.js");

//Creating bot with token
const bot = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  token: auth.token,
  autorun: true,
});

//Logging to console when bot is online
bot.on("ready", () => {
  console.log("EzRhyme Bot is online");
});

//Functionality
bot.on("message", function (user, userID, channelID, message, evt) {
  //Command prefix created
  if (message.substring(0, 1) == "^") {
    var args = message.substring(1).split(" ");
    var cmd = args[0];
    args = args.splice(1);

    //Necassary variable initializations for "rhyme" case
    var word = [];
    var rData = [];
    var maxCounter = 10;

    switch (cmd) {
      //Simple test command to check bots connection from time to time
      case "ping":
        bot.sendMessage({
          to: channelID,
          message: "Pong!",
        });
        break;

      /*Main bot functionality/concept:
      *see README*
      */
      case "rhyme":
        var flag = true;
        while (flag === true) {
          //Generates a random word and uses that word to retrieve the rhyming JSON from the datamuse API
          //It then fills an array, rData, with all the words in the JSON that rhyme with the random word generated
          word = randomWords(1);
          fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
            .then((res) => res.json())
            .then((json) => {
              let rhymeJson = JSON.stringify(json);
              if (rhymeJson.charAt(1) != "]") {
                flag = false;
                rhymeJson = JSON.parse(rhymeJson);
                fillJsonArray(rhymeJson, rData) //Helper function defined below
                var counter = rData.length;
                if (counter >= 20) {
                  initialMessage(channelID, word, counter); //Helper function defined below
                  //Bot listens to messages in channel and announces if a word has been said that rhymes with the generated word
                  bot.on(
                    "message",
                    function (user, userID, channelID, message, rawEvent) {
                      for (let j = 1; j < rData.length; j++) {
                        //console.log(rData[j]);
                        if (message === "^rhyme") {
                          console.log("test");
                          break;
                        }
                        if (message === rData[j]) {
                          counter--;
                          maxCounter--;
                          if (maxCounter == 0) {
                            finalMessage(channelID, word) //Helper function defined below
                            return;
                          }
                          followUpMessage(channelID, message, word, maxCounter, counter) //Helper function defined below
                        } 
                      }
                    }
                  );
                }
              } else {
                flag = true;
                console.error("Error - API gave word with no rhyme DB");
              }
            });
          break;
        }
        break;
    }
  }
});
//HELPER FUNCTIONS BELOW

//Function to fill an array with JSON data (in this case, word (the words that rhyme with the random generated word))
function fillJsonArray(json, arr){
  for (let i = 0; i < json.length; i++) {
    let temp = json[i].word;
    if (temp.includes(" ") == false) {
      arr.push(json[i].word);
    }
  }
}


//Basic helper function for first message bot sends on ^rhyme command
function initialMessage(channelID, word, counter) {
  bot.sendMessage({
    to: channelID,
    message:
      `:wave: Name 10 words that rhyme with **${word}**! :point_right: Possible words: ` +
      counter +
      "!",
  });
}

//Basic helper function for follow up message bot sends after a correct word is listened to
function followUpMessage(channelID, message, word, maxCounter, counter){
  bot.sendMessage({
    to: channelID,
    message:
      "☑️ **" +
      message +
      `** rhymes with the word **${word}!** *` +
      maxCounter +
      " more!* :point_right: Possible words: " +
      counter +
      "!",
  });
}

//Basic helper function for final bot sends when word has been rhymed 10 times
function finalMessage(channelID, word) {
  bot.sendMessage({
    to: channelID,
    message: `:astonished: You rhymed **${word}** with 10 words! :smile:`,
  });
}


