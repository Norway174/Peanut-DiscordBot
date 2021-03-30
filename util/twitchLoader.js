const moment = require("moment");
const fetch = require("node-fetch");

//const reqWidget = (widget) => require("../widgets/" + widget)

module.exports = client => {
	client.on("ready", () => {

		async function processWidget() {

			console.log("Should fire every minute?");

			var url = "https://api.twitch.tv/helix/streams?";
			client.twitch.forEach(async (channel) => {
				

				url += "user_login=" + channel.streamer + "&"
				
			});

			var online = await fetch(url, { method: 'GET', headers: { 'Client-ID' : '8wf7d6juj0mtmu3crdftx8ckw583ix' }})
			.then(res => res.json())
			.then(json => online = json.data);

			console.log(online);
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
