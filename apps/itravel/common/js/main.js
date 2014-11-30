

function wlCommonInit(){

}

function initMap() {
	$("#myMap").height($(window).height()-350);
	var map = new BMap.Map("myMap");          // 创建地图实例  
	
	var geolocation = new BMap.Geolocation();

	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			WL.Logger.debug('Your location: '+r.point.lng+','+r.point.lat);
			var point = new BMap.Point(r.point.lng, r.point.lat);
			map.centerAndZoom(point, 14);  
			
			var local = new BMap.LocalSearch(map, {
				renderOptions: {map: map, panel: "r-result"}
			});
			local.search("景点");


			//get the name of current city
			function getCity(result) {
				var cityName = result.name;
				localStorage.setItem("currentCity", cityName);

				//map.setCenter(cityName);
				WL.Logger.debug("You are now in: "+cityName);
			}

			var currentCity = new BMap.LocalCity();
			currentCity.get(getCity);

			setCityName();

		}
		else {
			WL.Logger.error('failed'+this.getStatus());
		}
	},{enableHighAccuracy: true});
	
}

function setCityName() {
	var currentCityName = localStorage.getItem("currentCity");
	document.getElementById('cityName').innerHTML= currentCityName;
}

function getCurrentPositionByBaiduMap() {
	var point;
	var geolocation = new BMap.Geolocation();

	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			WL.Logger.debug('Your location: '+r.point.lng+','+r.point.lat);
			point = new BMap.Point(r.point.lng, r.point.lat);
		}
		else {
			WL.Logger.error('failed'+this.getStatus());
		}
	},{enableHighAccuracy: true});
	return point;
}

function addMarkerByPoint(initpoint) {
	var marker = new BMap.Marker(initpoint);
	baiduMap.addOverlay(marker);
}

function loadMap(initpoint) {
	$('#map-container').height( $(window).height() );
	baiduMap.centerAndZoom(defaultPoint, 16);
	baiduMap.centerAndZoom(initpoint, 16);
	addMarkerByPoint(initpoint);
	baiduMap.panTo(initpoint);
}



function loadScenicList(cityCode) {
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

				var senics = JSON.parse(response);

				$seniclist = $('#seniclist');
				
				for(var i=0; i<senics.length ; i++) {

					$cityStr = JSON.stringify(senics[i]);
					//WL.Logger.debug("3.>>>>>"+JSON.stringify(senics[i]));

					var name = senics[i].name;
					var icon = senics[i].icon;
					var info = senics[i].info;
					$senicItem = $('<li><a href="scenic-detail.html" onclick="storeChosenScenicInfo($cityStr)"><img src="'+icon+'" alt="'+name+'" /><h3>'+name+'</h3><p>'+info+'</p></a></li>');
					$senicItem.appendTo($seniclist);
					$seniclist.listview("refresh");//refresh the element make css available
				}
				
			}
		},
		onFailure : function(result) {
			WL.Logger.error("Scenic retrieve failure");
		}
	});
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

function storeChosenScenicInfo(scenic) {
	localStorage.setItem("scenicChoice", scenic);
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
	//$currentScenicUL.listview("refresh");
}