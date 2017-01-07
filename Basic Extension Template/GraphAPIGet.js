// HTTP GET request function. 'theUrl' is passed from FacebookLogin.js and consists of the desired Graph API endpoint with the user's access token appended.
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        // XMLHttpRequests are Asynchronous, so this code detects when the request has successfully completed.
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

// Facebook JSON formatted data is converted to an object for easier handling.
function jsonParse(json) {
	var userData = JSON.parse(json);
	dataCleanup(userData);
}

// Deletes unnecessary data from JSON to reduce size of object for storage.
// Quick and dirty code, can be improved later.
function dataCleanup(bigData) {
	var dataValues = [];
	for (var x = 0; x < bigData.education.length; x++){
		dataValues.push(bigData.education[x].school.name);
		dataValues.push(bigData.education[x].year.name);
		delete bigData.education[x].id;
		delete bigData.education[x].school.id;
		delete bigData.education[x].year.id;
	}
	delete bigData.id;
	for (var x = 0; x < bigData.taggable_friends.data.length; x++){
		dataValues.push(bigData.taggable_friends.data[x].name);
		delete bigData.taggable_friends.data[x].id;
		delete bigData.taggable_friends.data[x].picture;
	}
	delete bigData.taggable_friends.paging;
	for (var x = 0; x < bigData.work.length; x++){
		// delete operator has issues handling undefined values, safety is implemented to avoid typeError later
		var workSafety = bigData['work'][x]['location'];
		dataValues.push(bigData['work'][x]['employer']['name']);
		delete bigData['work'][x]['employer']['id'];
		delete bigData.work[x].id;
		delete bigData.work[x].description;
		delete bigData.work[x].end_date;
		delete bigData.work[x].start_date;
		// error prevention / handling
		if (workSafety != null){
			dataValues.push(bigData['work'][x]['position']['name']);
			dataValues.push(bigData['work'][x]['location']['name']);
			delete bigData['work'][x]['location']['id'];
			delete bigData.work[x].position.id;
		}
		dataValues.push(bigData.favorite_teams[x].name);
		dataValues.push(bigData.hometown.name);
		delete bigData.favorite_teams[x].id;
		delete bigData.hometown.id;
	}
	console.log(dataValues);
	wordlistStore(bigData);
}

// Store JSON object in Google storage to retrieve later
function wordlistStore(jsonobject) {
	chrome.storage.sync.set({ "userdata" : jsonobject}, function() {
		if (chrome.runtime.error){
			alert("Runtime Error");
		}
});
}
