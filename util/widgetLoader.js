const moment = require("moment");

//const reqWidget = (widget) => require("../widgets/" + widget)

module.exports = client => {
	client.on("ready", () => {

		function processWidget() {

			client.widgets.forEach(widget => {
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

					/*if(client.guilds.get(widget.serverID).channels.get(widget.channelID) != isNullOrUndefined){

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


