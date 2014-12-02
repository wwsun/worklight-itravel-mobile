function getWeibo(lng, lat, range) {
	var input = {
			method: "get",
			path: "/2/place/nearby_timeline.json",
			parameters: {
				"lat" : lat,
				"long" : lng,
				"range" : range,
				access_token : "2.00AoNk3BbLIh6D81fe963ef20fYtOp"
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