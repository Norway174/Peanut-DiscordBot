const Rcon = require("rcon");

exports.run = (client, message, args) => {

	if (!args[0]){
		message.channel.send("Missing username.");
	} else
	if (!args[1]){
		message.channel.send("Missing message.");
	} else 
	{
		let usr = args[0];
		args.splice(0, 1);
		let msg = args.join(" ");

		var conn = new Rcon("149.56.241.15", 25640, "qqsTPXHSvoYgPQrdWHqs");
		// var conn = new Rcon("hostname", port, "password");

		conn.on("auth", function() {
			//console.log("Authed!");

			if (message.channel.type != "dm"){
				message.delete()
					.catch(err => {
						console.error(err);
					});
			}
			conn.send(`tellraw ${usr} ["",{"text":"${message.author.username} sent: ","color":"yellow"},{"text":"${msg}","color":"dark_purple"}]`);
		
		}).on("response", function(str) {
			console.log("Got response: " + str);
			if (!str){
				message.channel.send(`Message sent from ${message.author.username} to ${usr} was delivered.`)
					.then(m => {
						m.delete(6000);
					});
			} else {
				message.channel.send(str)
					.then(m => {
						m.delete(6000);
					});
			}
			

			conn.disconnect();
		
		}).on("end", function() {
			//console.log("Socket closed!");

		});
		
		conn.connect();
		


	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["tell"],
	permLevel: 0
};

exports.help = {
	name: "tell",
	description: "Send to a Minecraft users. Only for Helm of Rifts.",
	usage: "tell <username> <message>"
};