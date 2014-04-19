#!/usr/bin/env node

//config
var productionEnvironment = false;
var ps1Channel = "#pumpingstationone";
var config = {
  channels: [ps1Channel],
  server: "chat.freenode.net",
  botName: "brybot",
  configFileName: "/home/bry/brybot/config",
  haveIrcConsoleLog: false,
};

if(!productionEnvironment)
{
  config.configFileName = "config";
  config.haveIrcConsoleLog = true;
}

//setup
var irc = require("irc");
var fs = require("fs");

var bot = new irc.Client(config.server, config.botName, {
  debug: config.haveIrcConsoleLog,
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
//        console.log('error: ', message);
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
//      console.log("LOG: sender currently being ignored");
      return;
    }
    var text = message.args[1];

    // Prevent people from messaging the bot with commands that output to the
    // channel.
    if(to === config.botName) {
      if(isAdmin(nick)) //I'm sending directly to bot.
      {
        bot.say(ps1Channel, text);
        return;
      }
    }
    else {
      if(text.indexOf("!brybot") === 0)
      {
        bot.say(ps1Channel, addAssfaceModifier("ROGER", nick, ", ASSFACE!", "!"));
        return;
      }

      if(text.indexOf("!magic8ball") === 0 || text.indexOf("!8ball") === 0)
      {
        var lazy = text.indexOf("!8ball") === 0;

        if((!lazy && text.trim().length === "!magic8ball".length) || (lazy && text.trim().length === "!8ball".length))
        {
          bot.say(ps1Channel, addAssfaceModifier("You didn't ask a god damn question", nick, null, "."));
          return;
        }

        bot.say(ps1Channel, addAssfaceModifier(getRandom8ballResult(), nick, null, "."));
        return;
      }

      var diceCommandRe = /!(\d*)d(\d+)/;
      var result = text.match(diceCommandRe);
      if (result !== null) {
          var howManyDice = parseInt(result[1] === "" ? "1" : result[1], 10);
          var howManySides = parseInt(result[2], 10);

          if(howManyDice > 10 || howManySides > 9e+254) //haha
          {
            bot.say(ps1Channel, "ಠ_ಠ");
            return;
          }

          var i, numberString = '';
          for(i=0; i<howManyDice; i++)
          {
              var randomNumber = getRandomArbitrary(1, howManySides);
              if(randomNumber === 1) { randomNumber = "CRITICAL MISS"; }
              else if( randomNumber === howManySides) { randomNumber = "CRITICAL HIT"; }
              numberString += randomNumber + ", ";
          }
          numberString = numberString.substring(0, numberString.length - 2);
          bot.say(ps1Channel, numberString);
        return;
      }
    }

  });
}

function connect() {
  fs.readFile(config.configFileName, 'utf8', function(err, data) {
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
  return (nick === config.botName) ||
      (nick === "sudlowbot") ||
      (nick === "peoplemon")
      ;
}

function isAssface(nick)
{
  return (nick === "NegativeK") || (nick === "loans") || (nick === "Bioguy") || (nick === "Nackle");
}

function addAssfaceModifier(innocentMessage, nick, assModifier, normalModifier)
{
  if(assModifier == null)
  {
    assModifier = ", assface.";
  }

  if(isAssface(nick))
  {
    return innocentMessage = innocentMessage + assModifier;
  }

  return innocentMessage + normalModifier;
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
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
