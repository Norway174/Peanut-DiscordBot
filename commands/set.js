const settings = require('../settings.json');
exports.run = function(client, message, args){
	//let messagecount = parseInt(args.join(" "));
	
	let type = args[0];
	args.splice(0, 1)
	let arg = args.join(" ");
	
	/*if (!arg){
		console.log("missing args!");
		//return;
	}*/
	
	//console.log(arg)
	if (arg == "") arg = null
	if(type == "game"){
		//console.log("Game selected!");
		// Set Game
		client.user.setPresence({ game: { name: arg, type: 0 } })
			.then(user => {
				console.log("Game set to " + arg);
			})
			.catch(console.error);
	} else
	if (type == "status"){
		if (!arg) arg = "online"
		// Set the status
		client.user.setPresence({ status: arg })
			.then(user => {
				console.log("Status set to " + arg);
			})
			.catch(console.error);
	} else
	if (type == "avatar"){
		console.log("Avatar selected!");
		// Set avatar
		client.user.setAvatar(arg)
			.then(user => console.log(`New avatar set!`))
			.catch(console.error);
	} else
	{
		console.log("Not supported!");
	}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["s"],
  permLevel: 4
};

exports.help = {
  name: 'set',
  description: 'Sets the Game, Status or Avatar of the bot.',
  usage: `set game <optional:game name>\n${settings.prefix}set status <optional:online|idle|invisible|dnd>\n${settings.prefix}set avatar <url|local path>`
};
