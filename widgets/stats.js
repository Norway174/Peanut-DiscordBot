const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");


exports.run = function(client, widget, data){
	//client.logger.log(`WIDGET PROCESSED: ${widget.name}`);
	//message.channel.send("Current time: '" + Date.now() + "'");
	
	/*
	const widgetSettings = {
		serverID: widget.serverID,
		channelID: widget.channelID,
		messageID: widget.messageID,
		name: widget.name,
		type: widget.type,
		interval: widget.interval,
		intervalCount: 0,
		data: widget.data
	}
	
	//client.logger.log(widgetSettings)
	client.widgets.set(widget.name, widgetSettings);
	*/
	
	client.guilds.get(widget.serverID).channels.get(widget.channelID).fetchMessage(widget.messageID).then(m => {
		this.client = client;
	
		// const guilds = (await client.shard.broadcastEval('this.guilds.size'));//.reduce((a, b) => a + b, 0);
		// client.logger.log(guilds);
		const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		m.edit(`= STATISTICS =
  • Mem Usage   :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime      :: ${duration}
  • Users       :: ${this.client.users.size.toLocaleString()}
  • Servers     :: ${this.client.guilds.size.toLocaleString()}
  • Channels    :: ${this.client.channels.size.toLocaleString()}
  • Discord.js  :: v${version}
  • Node        :: ${process.version}
  • Source      :: https://github.com/Norway174/Peanut-DiscordBot

= WIDGET INFORMATION =
  • Widget Name :: ${widget.name}
  • Updates     :: Every ${widget.interval} minutes`, {code: "asciidoc"});
	});
	
};

exports.help = {
	name: "stats",
	description: "Display the bot stats in a neatly formated emblem.",
	usage: "No additional data required."
};