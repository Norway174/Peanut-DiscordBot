const settings = require('../settings.json');

exports.run = function(client, message, args){
	//Do stuff
	
	let action = args[0];
	let id = args[1];
	let type = args[2];
	let interval = parseInt(args[3]);
	
	args.splice(0, 4)
	let data = args.join(" ");
	
	if(action == "add"){
		
		if (!message.channel.type == "dm") message.delete()
		
		message.channel.send(`Widget placeholder. This is should be replaced soon. Identifier: '${id}'`)
		.then( msg => {
			const widgetSettings = {
				serverID: msg.guild.id,
				channelID: msg.channel.id,
				messageID: msg.id,
				name: id,
				type: type,
				interval: interval,
				intervalCount: interval,
				data: data
			}
			
			console.log(widgetSettings)
			client.widgets.set(id, widgetSettings);
		});
		
		
		
		
	} else
	if (action == "delete" || action == "del"){
		
		let result = client.widgets.delete(id);
		if (result){
			//Deleted
			message.channel.send(`'${id}' deleted.`)
		} else
		{
			//Failed
		message.channel.send(`Unable to delete. Make sure you typed '${id}' correctly.`)
		}
	} else
	if (action == "update"){

	} else
	{
		//console.log("Not supported!");
	}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["w"],
  permLevel: 3
};

exports.help = {
  name: 'widget',
  description: 'Controls for dynamaically updated messages, called widgets.',
  usage: 'widget add <unique name> <type>\n${settings.prefix}widget delete <unique name>'
};
