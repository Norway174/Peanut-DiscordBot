const moment = require("moment");

//const reqWidget = (widget) => require("../widgets/" + widget)

module.exports = client => {
	client.on("ready", () => {

		async function processWidget() {

			client.widgets.forEach(async (widget) => {
				//client.logger.log(`Processing ${require("util").inspect(widget)}`);
				/*
				widget = {
					serverID: widget.serverID,
					channelID: widget.channelID,
					messageID: widget.messageID,
					name: widget.name,
					type: widget.type,
					interval: widget.interval,
					intervalCount: 0,
					data: widget.data
				}
				*/
			
				let intervalCount = widget.intervalCount + 1;

				if(intervalCount >= widget.interval){
					intervalCount = 0;

					if(!client.guilds.get(widget.serverID)){
						client.logger.log("Server doesn't exist for " + widget.name + ", widget has been removed.")
						client.widgets.delete(widget.name);
						return;
					} else
					if(!client.channels.get(widget.channelID)){
						client.logger.log("Channel doesn't exist for " + widget.name + ", widget has been removed.")
						client.widgets.delete(widget.name);
						return;
					}

					var newMsg = false;

					const channel = client.channels.get(widget.channelID);
					await channel.fetchMessage(widget.messageID)
						.then(msg => {
							//if(msg.content == "") return; // Remove ghost message.
							//console.log(msg);
						})
						.catch(err => {
							//console.log(err);

							if(err.message == "Unknown Message"){ // Message is removed.
								newMsg = true;
							}
						});

					if(newMsg){
						await channel.send("New message placeholder.")
							.then(msg => {
								const msgID = client.widgets.get(widget.name);
								msgID.messageID = msg.id;
								client.widgets.set(widget.name, msgID);
								widget = client.widgets.get(widget.name);

								/*runWidget(client, widget);
								return;*/
							})
							.catch(err => {
								//console.log(err);
							});
					} /*else {
						runWidget(client, widget);
					}*/

					if (client.widgetsType.has(widget.type)){
						client.reloadWidget(widget.type);
				
						let command = widget.type;
						let cmd = client.widgetsType.get(command);
				
						if (cmd) {
				
							cmd.run(client, widget);
				
						}
					}

				}
				
				const updateInterval = client.widgets.get(widget.name);
				updateInterval.intervalCount = intervalCount;
				client.widgets.set(widget.name, updateInterval);
				
			});
		}
		
		
		// 60000 miliseconds = 1 minute
		var interval = 60 * 1000;
		let now = new Date();
		let delay = interval - now % interval;

		
		setTimeout(() => {
			processWidget();
			setInterval(processWidget, interval);
		}, delay);

	});
};


/*function runWidget(client, widget){
	if (client.widgetsType.has(widget.type)){
		client.reloadWidget(widget.type);

		let command = widget.type;
		let cmd = client.widgetsType.get(command);

		if (cmd) {

			cmd.run(client, widget);

		}
	}
};*/