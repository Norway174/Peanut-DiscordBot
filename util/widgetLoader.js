const moment = require('moment');
const log = message => {
	console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

//const reqWidget = (widget) => require("../widgets/" + widget)

module.exports = client => {
	client.on('ready', () => {
		
		//Load the widgets from the PCollection.
		//client.widgets
		
		function processWidget() {
			//console.log(`Procesing ${client.widgets.size}`);

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
				
				//console.log(widgetSettings)
				client.widgets.set(widget.name, widgetSettings);
				*/
				
				
				//console.log(client.widgets.constructor.name, typeof client.widgets);
				
				//console.log(`WIDGET ${widget}`);
				
				let intervalCount = widget.intervalCount + 1;
				
				log(`WIDGET ${widget.name}, ${widget.type}, ${widget.interval} / ${widget.intervalCount}`);
				
				//log(`WIDGET Interval: ${widget.interval} Count: ${widget.intervalCount}`);
				if(intervalCount >= widget.interval){
					//log(`WIDGET Count: ${widget.intervalCount} Reseting to zero`);
					intervalCount = 0;
					
					
					if (client.widgetsType.has(widget.type)){
					client.reloadWidget(widget.type)
					
					//log(`WIDGET TYPE Reloaded: ${widget.type}`);
					
					
					let command = widget.type;
					let cmd = client.widgetsType.get(command);

					if (cmd) {
						//log(`WIDGET PROCESSED: ${widget.name}`);
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
		
		processWidget();
		
		// 60000 miliseconds = 1 minute
		setInterval(processWidget, 60000);

	});
};


