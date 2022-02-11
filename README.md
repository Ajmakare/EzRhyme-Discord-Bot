# EzRhyme - Discord Rhyming Bot

"^rhyme" command will announce a random word that users should try to rhyme with. The bot will listen to all messages (from anyone, not just the person who ran the command) sent after the command and will announce if the word correctly rhymes with the randomly generated word and decrement counters accordingly (see images below for visual demonstration). It will continue to listen until 10 words have been rhymed with the random word.

Currently deployed on Vultr VPS, but coded for only 1 server. I am not planning on publicizing this project at least for the time being. This was mainly just a fun, learning Discord bot coding project.

![unknown](https://user-images.githubusercontent.com/92825395/148105223-f63d1632-61a1-4822-ace2-fc281122dbb0.png)

How it works: "^rhyme" command will generate a random word using a random-words module and assign it to a variable. This variable will then be used to access a rhyming API, a database of words that rhyme with said word. With a random-words module and the rhyming API together, they can accomplish the task with lots of JSON reading, array filling & traversing in order to compare words listened to (see bot.js & functions.js (helpers) for code).
 
![image](https://user-images.githubusercontent.com/92825395/153654048-bfec2773-df9e-4ad6-b16a-a4fa00331326.png)

... keeps going until 10 are guessed and: 

![image](https://user-images.githubusercontent.com/92825395/153654239-e2fc86e7-5e98-4712-b043-05c08e1c7ef8.png)


NOTE: The rhyming API is lenient... as in a lot of the words that "rhyme" with the randomly generate word are often not in the english dictionary and are some form of proper noun. This is THEIR implementation of what rhymes, not mine!
