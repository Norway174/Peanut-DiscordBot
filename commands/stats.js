const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = function(client, message, args){ // eslint-disable-line no-unused-vars
	this.client = client;
	
	// const guilds = (await client.shard.broadcastEval('this.guilds.size'));//.reduce((a, b) => a + b, 0);
	// console.log(guilds);
	const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

	var commands = client.stats.filterArray( (val, key) => key.includes("CMD"));
	commands = commands.reduce((total, amount) => total + amount);

	message.channel.send(`= STATISTICS =
  • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime     :: ${duration}
  • Users      :: ${this.client.users.cache.size.toLocaleString()}
  • Servers    :: ${this.client.guilds.cache.size.toLocaleString()}
  • Channels   :: ${this.client.channels.cache.size.toLocaleString()}
  • Cmds Exec  :: ${commands}
  • Discord.js :: v${version}
  • Node       :: ${process.version}
  • Source     :: https://github.com/Norway174/Peanut-DiscordBot`, {code: "asciidoc"});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["system", "usage"],
	permLevel: 0
};

exports.help = {
	name: "stats",
	description: "This command will display system stats such as memory used, uptime and version.",
	usage: "stats"
};
