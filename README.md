# EzRhyme - Discord Rhyming Bot

"^rhyme" command will announce a random word that users should try to rhyme with. The bot will listen to all messages (from anyone, not just the person who ran the command) sent after the command and will announce if the word correctly rhymes with the randomly generated word and decrement counters accordingly (see images below for visual demonstration). It will continue to listen until 10 words have been rhymed with the random word.

![unknown](https://user-images.githubusercontent.com/92825395/148105223-f63d1632-61a1-4822-ace2-fc281122dbb0.png)

How it works: "^rhyme" command will generate a random word using a random-words module and assign it to a variable. This variable will then be used to access a rhyming API, a database of words that rhyme with said word. With a random-words module and the rhyming API together, they can accomplish the task with lots of JSON reading, array filling & traversing in order to compare words listened to (see bot.js for code).
 
![startimageex](https://user-images.githubusercontent.com/92825395/148105873-b37e5c22-92c1-42b2-bb0c-c9ec494ac445.png)


...

![finalimageex](https://user-images.githubusercontent.com/92825395/148105738-a2eb2bb4-d522-4ecf-9307-c2df10c71fe0.png)
