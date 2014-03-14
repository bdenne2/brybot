#!/usr/bin/env node

//config
var ps1Channel = "#botwar";
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
  return nick.indexOf("NegativeK") > -1;
}

function isAdmin(nick)
{
  return nick === "bry";
}




