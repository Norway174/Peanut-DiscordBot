const Rcon = require("rcon");

exports.run = (client, message, args, perms, byCommand = true) => {
	var hostname = client.config.rcon.hostname;
	var port = client.config.rcon.port;
	var password = client.config.rcon.password;

	if (!byCommand) message.member = message;

	// Sets the parm. If we want to add or remove a user from the whitelist.
	var parm = "add";
	if(args.includes("-remove")){
		args.splice(args.indexOf("-remove"), 1);
		parm = "remove";
	}

	// Sets the username.
	var username = args.join(" ");
	//client.logger.debug("username: " + username);

	// Get the member role.
	var role = message.guild.roles.find(r => r.name == "Server Whitelisted");

	/*
	"byCommand" basically dictates if this command was run by a user command in chat.
	Or if this command was excecuted from somewhere else. This command is also executed from
	"events/guildMemberRemove.js" and "events/guildBanAdd.js".

	By default, we will assume this command was run from a user in chat.
	*/
	if (byCommand){
		// We only want this command to be executed in one channel only.
		if (message.channel.id != "530147169701986304") return; // 🥜 Peanut Craft -> 🔑💬-whitelist

		

		//client.logger.debug(role);

		let membersWithRole = message.guild.roles.get(role.id).members;
		membersWithRole = membersWithRole.filter(f => f.displayName != message.member.user.username)
		client.logger.debug(`Got ${membersWithRole.size} members with that role: ${membersWithRole.map(mem => mem.displayName)}`)
		if(membersWithRole.find(mem => mem.displayName == username)) {
			//client.logger.debug("Name is taken!");
			if(parm != "remove"){
				message.channel.send("Sorry! Name already in use on this server.")
				.then(m => {
					m.delete(15000);
				});
				message.delete(15000);
				return;
			}
			
		}

		// Makes sure you can't sign up again with the same name.
		if(message.member.roles.has(role.id) && message.member.displayName == username && parm != "remove"){
			
			message.channel.send("You can't whitelist your own name again.")
			.then(m => {
				m.delete(15000);
			});
			message.delete(15000);
			return;
		}
	}

	var byCommandReturn = ""; // This is the return string we return if this was not ran as a command.

	// Opens the connection to the RCON.
	var conn = new Rcon(hostname, port, password);

	var done = false;

	conn.on("auth", () => {
		client.logger.log("Authed!");

		conn.send(`whitelist ${parm} ${username}`);
		
		done = true;
	})
	.on("response", str => {
		client.logger.log("Got response: " + str);


		if(byCommand) message.channel.send(str)
		.then(m => {
			m.delete(15000);
		});

		if(!byCommand) byCommandReturn = byCommandReturn + "\n" + str;
		

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
			if(parm == "remove" && byCommand) {
				if(message.member){
					message.member.setNickname(message.member.user.username);
					message.member.removeRole(role);
				}
			}
			//client.logger.debug("Unclaiming all of " + message.member.displayName + " claims.");
			conn.send(`chunks unclaim_all all ${message.member.displayName}`);
			//client.logger.debug("Unclaimed.")
			done = true;

		} else if(str.startsWith("' cannot be found")){
			// The user could not be found when trying to remove their chunks.

			done = true;
			
		} else {
			done = true;
		}

		if(done) conn.disconnect();
	})
	.on("end", () => {
		client.logger.log("Socket closed!");
		if (byCommand) message.delete(15000);
		if (!byCommand) return byCommandReturn;
	})
	.on("error", err => {
		client.logger.log("Socket: " + err);
		if (byCommand){
			message.channel.send("```" + err + "```Please try again, or contact an admin if this happens again.")
			.then(m => {
				m.delete(15000);
			});
			message.delete(15000);
		}
		if (!byCommand) return "\nError:```" + err + "```";
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
	description: "Whitelist to a Minecraft users. Only for Peanut Craft.",
	usage: "whitelist <username>"
};
