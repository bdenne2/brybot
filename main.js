#!/usr/bin/env node

//config
var ps1Channel = "#pumpingstationone";
var config = {
  channels: [ps1Channel],
  server: "chat.freenode.net",
  botName: "brybot",
};

//setup
var irc = require("irc");
var fs = require("fs");

var bot = new irc.Client(config.server, config.botName, {
  debug: true,
  autoConnect: false,
  port: 8001,
  floodProtection: true
});

var magic8ballAnswers = [
"It is certain",
"It is decidedly so",
"Without a doubt",
"Yes definitely",
"You may rely on it",
"As I see it, yes",
"Most likely",
"Outlook good",
"Yes",
"Signs point to yes",
"Reply hazy try again",
"Ask again later",
"Better not tell you now",
"Cannot predict now",
"Concentrate and ask again",
"Don't count on it",
"My reply is no",
"My sources say no",
"Outlook not so good",
"Very doubtful"
];

//main
addListeners();
connect();

//functions
function addListeners() {

  bot.addListener('error', function(message) {
        console.log('error: ', message);
  });

  bot.addListener("notice", function(from, to, text, message) {
    if(to == config.botName && text.indexOf("You are now identified") > -1)
    {
      bot.join(ps1Channel, function()
        {
  //        bot.say(ps1Channel, "I'm ALLLLLLIIIVVVVE");
        });
    }
  });

  bot.addListener("message", function(nick,to,text,message)
  {
    if(doIgnore(nick))
    {
      console.log("LOG: sender currently being ignored");
      return;
    }
    var text = message.args[1];

    if(isAdmin(nick) && to === config.botName) //I'm sending directly to bot.
    {
      bot.say(ps1Channel, text);
      return;
    }

    if(text.indexOf("!brybot") === 0)
    {
      if(isAssface(nick))
      {
        bot.say(ps1Channel, "ROGER, ASSFACE!");
      }
      else
      {
        bot.say(ps1Channel, "ROGER!");
      }
      return;
    }
    
    if(text.indexOf("!magic8ball") === 0 || text.indexOf("!8ball") === 0)
    {
      var lazy = text.indexOf("!8ball") === 0;

      if((!lazy && text.trim().length === "!magic8ball".length) || (lazy && text.trim().length === "!8ball".length))
      {
        if(isAssface(nick))
        {
          bot.say(ps1Channel, "You didn't ask a god damn question, assface.");
        }
        else
        {
          bot.say(ps1Channel, "You didn't ask a god damn question.");
        }
        return;
      }
      
      var botString = getRandom8ballResult();
      if(isAssface(nick))
      {
        botString = botString + ", assface.";
      }
      
      bot.say(ps1Channel, botString);
      if(lazy)
      {
        bot.say(ps1Channel, "Y'all are lazy.");
      }
      return;
    }

  });
}

function connect() {
  fs.readFile('config', 'utf8', function(err, data) {
    if(err) {
      return console.log(err);
    }

    bot.connect(function() {
      console.log("bot connected?"); 
      bot.say("nickServ", "identify " + data);
    });

  });
}

function doIgnore(nick)
{
  return (nick.indexOf(config.botName) > -1 ||
      nick.indexOf("sudlowbot") > -1 ||
      nick.indexOf("peoplemon") > -1
      
      );
}

function isAssface(nick)
{
  return nick.indexOf("NegativeK") > -1 || nick.indexOf("loans") > -1;
}

function isAdmin(nick)
{
  return nick === "bry";
}

function getRandom8ballResult()
{
  return magic8ballAnswers[getRandomArbitrary(0,19)];
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
