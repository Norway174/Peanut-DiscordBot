exports.run = function(client, message){
	//message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp} ms\``);
	 message.channel.send("Pinging...").then(m => m.edit(`Pong! Latency is \`${m.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${Math.round(client.ping)}ms\``) );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'Ping/Pong. Used for simple bot response testing.',
  usage: 'ping'
};