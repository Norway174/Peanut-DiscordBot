const Rcon = require("rcon");

exports.run = (client, message, args) => {
	// We only want this command to be executed in one server only.
	if (message.guild.id != "530136682541088789") return; // 🥜 Peanut Craft

	var hostname = client.config.rcon.hostname;
	var port = client.config.rcon.port;
	var password = client.config.rcon.password;

	// Sets the username.
	var command = args.join(" ");

	// Opens the connection to the RCON.
	var conn = new Rcon(hostname, port, password);

	conn.on("auth", () => {
		client.logger.log("Authed! Sending command: " + command);

		conn.send(command);
		
	})

	.on("response", str => {
		if (str == "") str = "Command sent. But there was no response."

		client.logger.log("Got response: " + str);

		message.channel.send("```" + str + "```")
		conn.disconnect();
	})

	.on("end", () => {
		client.logger.log("Socket closed!");
	})

	.on("error", err => {
		client.logger.log("Socket: " + err);
		
		message.channel.send(err)
		.then(m => { m.delete(15000); });
	});

	conn.connect();
		
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: "rcon",
	description: "Issue remote commands to a Minecraft server. Only for Peanut Craft.",
	usage: "rcon <command>"
};
