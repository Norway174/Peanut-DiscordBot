

module.export = client => {
	
	myName = client.user.username;
	myID = client.user
	console.log("I am ready! Logged in as: " + myName + " [" + myID + "]");
	
	
	//console.log("Peanut ready!");
	
	/* //DEBUG
	var json = util.inspect(client.guilds, {showHidden: false, depth: null});
	fs.writeFile("channels.json", json);

	var json2 = util.inspect(require.cache, {showHidden: false, depth: null});
	fs.writeFile("cache.json", json2);*/

	//console.log(util.inspect(client.guilds, {showHidden: false, depth: null}))
	
}