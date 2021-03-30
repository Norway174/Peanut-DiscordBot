const settings = require("../config.js");
const Discord = require("discord.js");

exports.run = function(client, message, args){
	//let messagecount = parseInt(args.join(" "));
	
	let type = args[0];
	args.splice(0, 1);
	let arg = args.join(" ");
	
	const embed = new Discord.MessageEmbed();
	/*
	.setTitle(hostname + ":" + port)
	.setColor(0x009600)
	.setDescription( ms.current_players + " / " + ms.max_players + " Online\nMessage of the day:```\n" + ms.motd + "```")
	.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
	.setThumbnail("http://i.imgur.com/2JUhMfW.png")
	.setTimestamp()*/
	
	client.logger.log("Selected: " + type);
	
	if (arg == "") arg = null;
	if(type == "game"  || type == "g"){
		//client.logger.log("Game selected!");
		// Set Game
		client.user.setPresence({ game: { name: arg, type: 0 } })
			.then(user => {
				//console.log("Game set to " + arg);
				if (!arg) arg = "nothing.";
				const embed = new Discord.MessageEmbed()
					.setTitle("Game updated")
					.setColor(0x7EFF00)
					.setDescription("Game set to " + arg);
				message.channel.send({embed});
				
			})
			.catch(console.error);
	} else
	if (type == "status" || type == "s"){
		if (!arg) arg = "online";
		// Set the status
		client.user.setPresence({ status: arg })
			.then(user => {
				//client.logger.log("Status set to " + arg);
				const embed = new Discord.MessageEmbed()
					.setTitle("Status updated")
					.setColor(0x7EFF00)
					.setDescription("Status set to " + arg);
				message.channel.send({embed});
				
			})
			.catch(console.error);
	} else
	if (type == "avatar" || type == "a"){
		//client.logger.log("Avatar selected!");
		// Set avatar
		client.user.setAvatar(arg)
			.then(user => {
				console.log("New avatar set: " + arg);
				const embed = new Discord.MessageEmbed()
					.setTitle("Avatar updated")
					.setColor(0x7EFF00)
					//.setDescription("Avatar updated.")
					.setImage(arg);
				message.channel.send({embed});
				
			})
			.catch(err =>{
				console.error(err);
				console.log("Type: " + type + "\nArg: " + arg);
			});
	} else
	{
		//client.logger.log("Not supported!");
	}
	
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["s"],
	permLevel: 4
};

exports.help = {
	name: "set",
	description: "Sets the Game, Status or Avatar of the bot.",
	usage: `set game <optional:game name>\n{prefix}set status <optional:online|idle|invisible|dnd>\n{prefix}set avatar <url|local path>`
};
