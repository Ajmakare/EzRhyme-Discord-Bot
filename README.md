# DiscordRhymeBot

![EzR-logos3](https://user-images.githubusercontent.com/92825395/148104923-b805badc-1410-46d4-a5b7-238f3e95dc5a.jpeg)

A command will announce a word that users should try to rhyme with. The bot will listen and tell you if you are correct or not (your word rhymes with the word announced or not). It will continue to listen until all words have been said that rhyme with announced word (checks for 10 words).

 How it works: "^rhyme" command will generate a random word. This word will then be used to access a rhyming API, a database of words that rhyme with said word. With a random word and the rhyming API together, they can accomplish the task with lots of JSON reading, array filling & traversing in order to compare words listened to. 
