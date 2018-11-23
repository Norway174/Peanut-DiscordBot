const Rcon = require("rcon");

exports.run = (client, message, args, byCommand = true) => {
	var hostname = client.config.rcon.hostname;
	var port = client.config.rcon.port;
	var password = client.config.rcon.password;

	// Sets the parm. If we want to add or remove a user from the whitelist.
	var parm = "add";
	if(args.includes("-remove")){
		args.splice(args.indexOf("-remove"), 1);
		parm = "remove";
	}

	// Sets the username.
	var username = args.join(" ");
	//client.logger.debug("username: " + username);

	/*
	"byCommand" basically dictates if this command was run by a user command in chat.
	Or if this command was excecuted from somewhere else. This command is also executed from
	"events/guildMemberRemove.js" and "events/guildBanAdd.js".

	By default, we will assume this command was run from a user in chat.
	*/
	if (byCommand){
		// We only want this command to be executed in one channel only.
		if (message.channel.id != "488392710517030923") return; // Chaos Grid -> Whitelist

		// Get the member role.
		var role = message.guild.roles.find(r => r.name == "Member");

		let membersWithRole = message.guild.roles.get(role.id).members;
		//client.logger.debug(`Got ${membersWithRole.size} members with that role.`)
		if(membersWithRole.find(mem => mem.displayName == username)) {
			//client.logger.debug("Name is taken!");
			message.channel.send("Sorry! Name already in use on this server.")
			.then(m => {
				m.delete(15000);
			});
			message.delete(15000);
			return;
		}
	}
	// Opens the connection to the RCON.
	var conn = new Rcon(hostname, port, password);

	var done = false;

	conn.on("auth", () => {
		console.log("Authed!");

		conn.send(`whitelist ${parm} ${username}`);
		
		done = true;
	})
	.on("response", str => {
		console.log("Got response: " + str);

		if (byCommand){
			message.channel.send(str)
			.then(m => {
				m.delete(15000);
			});
		}

		if(str.startsWith("Could not add")){
			// The user could not be added!

			done = true;
		} else if(str.startsWith("Added")) {
			//The user was added!

			//client.logger.debug("Added user!")

			done = true;
			if(message.member.roles.has(role.id)){
				done = false;
				conn.send(`whitelist remove ${message.member.displayName}`);
			}

			message.member.setNickname(username, "Whitelist");
			message.member.addRole(role);
	
		} else if(str.startsWith("Removed")) {
			// The user was successfully removed.
			if(parm == "remove") {
				if(message.member){
					message.member.setNickname(message.member.user.username);
					message.member.removeRole(role);
				}
			}
			//client.logger.debug("Unclaiming all of " + message.member.displayName + " claims.");
			conn.send(`chunks unclaim_all all ${message.member.displayName}`);
			//client.logger.debug("Unclaimed.")
			done = true;
		} else {
			done = true;
		}

		if(done) conn.disconnect();
	})
	.on("end", () => {
		console.log("Socket closed!");
		if (byCommand) message.delete(15000);
	});
	
	conn.connect();
		
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["signup", "register"],
	permLevel: 0
};

exports.help = {
	name: "whitelist",
	description: "Whitelist to a Minecraft users. Only for Chaos Grid.",
	usage: "whitelist <username>"
};
