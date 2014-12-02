function wlCommonInit(){
	getCurrentPositionByBaiduMap();

	getCodeByCityName(localStorage.getItem("currentCity"));
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
	$currentScenicImg = $('<img src="'+scenicJson.icon+'"><h3>Name: '+scenicJson.name+'</h3>');
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
				//Todo:
				localStorage.setItem("weiboList", JSON.stringify(result.invocationResult.interestingData));
			} else {
				WL.Logger.error("Cannot analysis the json file");
			}
		},
		onFailure: function(result){
			WL.Logger.error("Get weibo failure: "+result);
		}
	});
}

function displayWeiboList() {
	$weiboUL = $('#weibo-list');
	var weiboJsonArr = JSON.parse(localStorage.getItem("weiboList"));
	for(var i=0; i<weiboJsonArr.length; i++) {
		//WL.Logger.error(weiboJsonArr[i].text);
		$weiboLI = $('<li><img src="'+weiboJsonArr[i].user.avatar_hd+'"><h1>'
		+weiboJsonArr[i].user.name+'</h1><p>'+weiboJsonArr[i].text
		+'</p><span class="ui-li-count ui-li-aside">'
		+weiboJsonArr[i].distance +' m</span></li>');
		$weiboLI.appendTo($weiboUL);
	}

}