function wlCommonInit(){
	getCurrentPositionByBaiduMap();
	getCodeByCityName(localStorage.getItem("currentCity"));
	getNearbyWeibo();
}

//1.store current city name
//2.store current pos
function getCurrentPositionByBaiduMap() {
	var geolocation = new BMap.Geolocation();

	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			WL.Logger.debug('Your location: '+r.point.lng+','+r.point.lat);
			var currentPos = { lng:r.point.lng, lat:r.point.lat};

			//store current position
			localStorage.setItem("currentPosition", JSON.stringify(currentPos));
			
			function getCity(result) {
				var cityName = result.name;
				//store current city
				localStorage.setItem("currentCity", cityName);
			}

			var currentCity = new BMap.LocalCity();
			currentCity.get(getCity);//get the name of current city
			
		}
		else {
			WL.Logger.error('failed'+this.getStatus());
		}
	},{enableHighAccuracy: true});
}

function loadBaiduMap() {
	var map = new BMap.Map("r-map");
	var currentPosition = JSON.parse(localStorage.getItem("currentPosition"));
	var point = new BMap.Point(currentPosition.lng, currentPosition.lat);
	map.centerAndZoom(point, 14);
	
	var local = new BMap.LocalSearch(map, {
		renderOptions: {map: map, panel: "r-result"}
	});
	local.search("景点");
}

function setCityName() {
	document.getElementById('cityName').innerHTML= localStorage.getItem("currentCity");
}

function getScenicListByCode(cityCode) {
	var invocationData = {
		adapter: "MongoAdapter",
		procedure: "getScenicsByCityCode",
		parameters: [cityCode]
	};

	WL.Client.invokeProcedure(invocationData,{
		onSuccess : function(result) {
			WL.Logger.debug("Get scenic list by CITY CODE successfully!");
			if(result.invocationResult.isSuccessful) {
				var response = result.invocationResult.result;
				localStorage.setItem("scenicList", response);
			} else {
				localStorage.setItem("scenicList", "{}");
			}
		},
		onFailure : function(result) {
			WL.Logger.error("Scenic retrieve failure");
		}
	});
}

function loadScenicList() {
	var scenics = JSON.parse(localStorage.getItem("scenicList"));
	$sceniclist = $('#scenic-list');
	for(var i=0; i<scenics.length ; i++) {
		$cityStr = JSON.stringify(scenics[i]);
		var name = scenics[i].name;
		var icon = scenics[i].icon;
		var info = scenics[i].info;
		$scenicItem = $('<li><a href="detail.html" onclick="storeChosenScenicInfo($cityStr)"><img src="'+icon+'" alt="'+name+'" /><h3>'+name+'</h3><p>'+info+'</p></a></li>');
		$scenicItem.appendTo($sceniclist);
		//$sceniclist.listview("refresh");//refresh the element make css available
	}
}

function storeChosenScenicInfo(scenic) {
	localStorage.setItem("scenicChoice", scenic);
}

function getCodeByCityName(cityName) {
	var invocationData = {
		adapter: "MongoAdapter",
		procedure: "getCodeByName",
		parameters: [cityName]
	};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : function(result) {
			if(result.invocationResult.isSuccessful) {
				var response = result.invocationResult.result;
				localStorage.setItem("cityCode", response.toString());
			}
		},
		onFailure : function(result) {
			WL.Logger.error("Cannot get the table of city codes");
		}
	});
}

function displayChosenScenicInfo() {
	var scenic = localStorage.getItem("scenicChoice");
	var scenicJson = JSON.parse(scenic);
	$currentScenicDiv = $('#scenic_detail');
	$currentScenicImg = $('<img src="'+scenicJson.icon+'" class="img-center"><h3 class="forrit">'+scenicJson.name+'</h3>');
	$currentScenicName = $('<p>'+scenicJson.info+'</p>');
	$currentScenicStar = $('<p>Score: '+scenicJson.star+'</p>');
	$currentScenicImg.appendTo($currentScenicDiv);
	$currentScenicName.appendTo($currentScenicDiv);
	$currentScenicStar.appendTo($currentScenicDiv);
}

function getNearbyWeibo() {
	var currentPos = JSON.parse(localStorage.getItem("currentPosition"));
	var invocationData = {
		adapter: "WeiboAdapter",
		procedure: "getWeibo",
		parameters: [currentPos.lng.toString(), currentPos.lat.toString(), "1000"]
	};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: function(result) {
			WL.Logger.debug("Get weibo successfully!");
			if(result.invocationResult.interestingData.length > 0) {
				localStorage.setItem("weiboList", JSON.stringify(result.invocationResult.interestingData));
			} else {
				WL.Logger.error("Cannot analysis the json file");
				localStorage.setItem("weiboList","{}");
			}
		},
		onFailure: function(result){
			WL.Logger.error("Get weibo failure: "+result);
		}
	});
}

function displayWeiboList() {
	
	$weiboList = $('#weibo_list');
	var weiboJsonArr = JSON.parse(localStorage.getItem("weiboList"));
	for(var i=0; i<weiboJsonArr.length; i++) {
		$weiboDiv = $('<div class="image group"><div class="grid images_3_of_1"><img class="img-circle" src="'+
				weiboJsonArr[i].user.avatar_hd+'"/></div><div class="grid span_2_of_3"><h3>'+
				weiboJsonArr[i].text+'</h3><p>'+weiboJsonArr[i].user.name+'<small> '+
				weiboJsonArr[i].distance+'m</small></p></div><div class="clear"></div></div>');
		
		$weiboDiv.appendTo($weiboList);
	}
}

function sendWeibo() {
	var content = $('#comments').val();
	var invocationData = {
		adapter: "WeiboAdapter",
		procedure: "sendWeibo",
		parameters: [content]
	};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: function(result) {
			if(result.invocationResult.isSuccessful) {
				WL.Logger.debug("Send successfully!");
				WL.SimpleDialog.show("Send result", "Sending successfully!", 
						[{	text: "OK", 
							handler: function(){
								WL.Logger.debug("Button Clicked");
							}   
						}]);
			} else {
				WL.Logger.error("Cannot analysis the json file");
			}
		},
		onFailure: function(result){
			WL.Logger.error("Send weibo failure: "+result);
		}
	});
}