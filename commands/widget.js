exports.run = function(client, message, args){
	//Do stuff
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["w"],
  permLevel: 3
};

exports.help = {
  name: 'widget',
  description: 'Controls for dynamaically updated messages, called wisgets.',
  usage: 'widget <add/delete> <id>'
};
