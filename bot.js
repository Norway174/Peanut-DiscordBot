const Discord = require("discord.js");
const client = new Discord.Client();

const util = require('util');
const fs = require("fs");

const settings = require("./settings.json");

require('./util/eventLoader')(client);

// ms = Minestat, to get the Minecraft server status.
const ms = require('./minestat/minestat.js');


var prefix = settings.prefix;
var myID = "";
var myName = "";
 
/*client.on("ready", () => {
	myName = client.user.username;
	myID = client.user
	console.log("I am ready! Logged in as: " + myName + " [" + myID + "]");
	
	 //DEBUG
	var json = util.inspect(client.guilds, {showHidden: false, depth: null});
	fs.writeFile("channels.json", json);

	var json2 = util.inspect(require.cache, {showHidden: false, depth: null});
	fs.writeFile("cache.json", json2);

	//console.log(util.inspect(client.guilds, {showHidden: false, depth: null}))

});*/
 
client.on("message", message => {
	console.log("[" + message.createdAt.toLocaleString("nb-NO") + "] " +message.author.username + ": " + message.content)
	
	//Check if received text is a command
	var isCmd = isCommand(message.content);
	console.log(isCmd);
	
	//If the received text is not a command, then return. Stopping the processing here.
	if(isCmd == false || message.author.bot) return;
	
	//Split the message up into args, if there are any.
	const args = message.content.split(" ").slice(1);
	
	//Selecting the proper command. Add more commands here.
	if (message.content.startsWith(prefix + "ping")) {
		//Test ping pong
		message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp} ms\``);
		//message.delete(5);
		
	} else
	if (message.content.startsWith(prefix + "hello")) {
		//Test Hello message
		message.channel.send("Hello! I am alive!");
		message.delete(5);
		
	} else
	if (message.content.startsWith(prefix + "status")) {
		//Return server status
		checkMCServer(message);
		
	} else
	if (message.content.startsWith(prefix + "eval")) {
		
		//MAKE SURE ONLY THE HOST OF THIS BOT CAN RUN THIS COMMAND!
		//VERY DANGEROUS COMMAND TO GIVE ACCESS TOO!
		var hostID = settings.hostID;
		if(message.author.id !== hostID){
			console.log(message.author.username + " tried to run Eval.")
			message.channel.send("Access denied!", {code:"xl"});
			return;
		}
		//Run Javascript, and output the result to chat.
		try {
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string")
			evaled = require("util").inspect(evaled);

			message.channel.send(evalClean(evaled), {code:"xl"});
			
		} catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${evalClean(err)}\n\`\`\``);
		}
	} /*else
	if (message.content === prefix + "command") {
		
		//Do stuff here!
		//message.channel.send("message");
		
	}*/

	

});


function isCommand(command){
	
	if(command.startsWith(prefix) | command.startsWith(myID)){
		
		return true;
	} else {
		return false;
	}
}

function checkMCServer(message){
	//var hostname = "minecraft.frag.land";
	var hostname = settings.minecraft;
	var port = 25565;
	
	//Make the first emblem, for checking status
	const embed = new Discord.RichEmbed()
			.setTitle(hostname + ":" + port)
			.setColor(0xFFD200)
			.setDescription( "Checking...")
			.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
			.setThumbnail("http://i.imgur.com/YRmvlBI.png")
			.setTimestamp()
	
	//Not really needed, just added as a cool-factor.
	//Makes the bot appear as if it's typing while checking the status.
	message.channel.startTyping();
	
	//Send the checking... message.
	message.channel.send({embed})
	.then(message2 => {
	 
		//Then we do the check.
		ms.init(hostname, port, function(result) {
		
			console.log("Minecraft server status of " + ms.address + " on port " + ms.port + ":");
			
			//And if it's online then we do this...
			if(ms.online) {
			  
			  
				console.log("Server is online running version " + ms.version + " with " + ms.current_players + " out of " + ms.max_players + " players.");
				console.log("Message of the day: " + ms.motd);
				
				//Here, we build the emblem for the online server.
				const embed = new Discord.RichEmbed()
					.setTitle(hostname + ":" + port)
					.setColor(0x009600)
					.setDescription( ms.current_players + " / " + ms.max_players + " Online\nMessage of the day:```\n" + ms.motd + "```")
					.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
					.setThumbnail("http://i.imgur.com/2JUhMfW.png")
					.setTimestamp()
				
				//And then edit the first message we sent. We don't want duplicate messages in our chat.
				message2.edit({embed});
			
			
			} else {  
				console.log("Server is offline!");
				
				//Here we build the offline message
				const embed = new Discord.RichEmbed()
					.setTitle(hostname + ":" + port)
					.setColor(0xE40000)
					.setDescription("Offline")
					.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
					.setThumbnail("http://i.imgur.com/AhMUw4E.png")
					.setTimestamp()
				
				//And the same as before, we edit the first message with the offline message.
				message2.edit({embed});			
			}
			//Stop the typing effect.
			message.channel.stopTyping();
		});
	});
}

function evalClean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.login(settings.token)
 
