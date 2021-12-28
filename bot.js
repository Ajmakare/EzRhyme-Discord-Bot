const Discord = require("discord.io");
const auth = require("./auth.json");
const axios = require("axios");
const fetch = require("node-fetch");

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

    switch (cmd) {
      case "ping":
        bot.sendMessage({
          to: channelID,
          message: "Pong!",
        });
        break;

      case "testAPI":
        fetch("https://api.datamuse.com/words?sp=hipopatamus")
          .then((res) => res.json())
          .then((json) => {
            //View in console (pure JSON)
            let someJson = JSON.stringify(json);
            console.log(someJson);
            bot.sendMessage({
              to: channelID,
              message: someJson,
            });
          });
        break;
    }
  }
});
