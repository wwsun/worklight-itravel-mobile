function getWeibo(lng, lat, range) {
	var input = {
			method: "get",
			path: "/2/place/nearby_timeline.json",
			parameters: {
				"lat" : lat,
				"long" : lng,
				"range" : range,
				access_token : "2.002vz5tFm2f_sC2f25d617a9yJpihB"
			},
			returnedContentType : "json"
	};
	
	var backendResponse = WL.Server.invokeHttp(input);
	var procedureResponse = {};
	if(backendResponse.isSuccessful) {
		procedureResponse.interestingData = backendResponse.statuses;
	} else {
		procedureResponse.isSuccessful = false;
	}	
	return procedureResponse;
}

function sendWeibo(content) {
	var input = {
			method: "post",
			path: "/2/statuses/update.json",
			parameters: {
				status : content,
				access_token : "2.002vz5tFm2f_sC2f25d617a9yJpihB"
			},
			returnedContentType : "json"
	};
	
	var backendResponse = WL.Server.invokeHttp(input);
	var procedureResponse = {};
	if(backendResponse.isSuccessful) {
		procedureResponse = backendResponse;
	} else {
		procedureResponse.isSuccessful = false;
	}	
	return procedureResponse;
}