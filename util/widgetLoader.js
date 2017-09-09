const moment = require('moment');

//const reqWidget = (widget) => require("../widgets/" + widget)

module.exports = client => {
	client.on('ready', () => {
		
		//Load the widgets from the PCollection.
		//client.widgets
		
		function processWidget() {
			//client.log(`Procesing ${client.widgets.size}`);

			client.widgets.forEach(widget => {
				widget = JSON.parse(widget);
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
				
				//client.log(widgetSettings)
				client.widgets.set(widget.name, widgetSettings);
				*/
				
				
				//client.log(client.widgets.constructor.name, typeof client.widgets);
				
				//client.log(`WIDGET ${widget}`);
				
				let intervalCount = widget.intervalCount + 1;
				
				//client.log(`WIDGET ${widget.name}, ${widget.type}, ${widget.interval} / ${widget.intervalCount}`);
				
				//client.log(`WIDGET Interval: ${widget.interval} Count: ${widget.intervalCount}`);
				if(intervalCount >= widget.interval){
					//client.log(`WIDGET Count: ${widget.intervalCount} Reseting to zero`);
					intervalCount = 0;
					
					
					if (client.widgetsType.has(widget.type)){
					client.reloadWidget(widget.type)
					
					//client.log(`WIDGET TYPE Reloaded: ${widget.type}`);
					
					
					let command = widget.type;
					let cmd = client.widgetsType.get(command);

					if (cmd) {
						//client.log(`WIDGET PROCESSED: ${widget.name}`);
						cmd.run(client, widget);
						//log(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${msg}] [RESULT: Success.]`)
					}
					
					
					}
				}
				
				const updateInterval = client.widgets.get(widget.name);
				updateInterval.intervalCount = intervalCount;
				client.widgets.set(widget.name, updateInterval);
				
			});
		}
		
		
		var interval = 60 * 1000;
		let now = new Date();
        let delay = interval - now % interval;

		
		// 60000 miliseconds = 1 minute
		setTimeout(() => {
			processWidget();
			setInterval(processWidget, interval);
		}, delay);

	});
};


