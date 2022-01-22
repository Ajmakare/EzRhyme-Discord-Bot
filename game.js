let Game = class {
  constructor() {
    this.rData = [];
    this.word = [];
    this.check;
    this.counter;
    this.flag = true;
    this.maxCounter = 10;
  }

  //HELPER FUNCTIONS

//Function to fill an array with JSON data (in this case, word (the words that rhyme with the random generated word))
//Returns true if new array, false if old
fillJsonArray(json, arr) {
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
initialMessage(channelID, word, counter, check, maxCounter, bot) {
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
followUpMessage(channelID, message, word, maxCounter, counter, bot) {
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
finalMessage(channelID, message, word, bot) {
  bot.sendMessage({
    to: channelID,
    message:
      "☑️ **" +
      message +
      `** rhymes with the word **${word}!** ` +
      `:astonished: You rhymed **${word}** with 10 words! :smile:`,
  });
}

};

module.exports = Game;



