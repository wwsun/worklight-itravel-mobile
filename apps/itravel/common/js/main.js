var baiduMap = new BMap.Map("map-container");
var defaultPoint = new BMap.Point(118.825438, 31.889814);

function wlCommonInit(){
	//var point = getCurrentPositionByBaiduMap();
	//initMap(point);
	//$(document).ready(initMap);
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
		}
		else {
			WL.Logger.error('failed'+this.getStatus());
		}
	},{enableHighAccuracy: true});
	
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
				//WL.Logger.debug(senics);

				$seniclist = $('#seniclist');
				
				for(var i=0; i<senics.length ; i++) {
					var name = senics[i].name;
					//var info = senics[i].info;
					var icon = senics[i].icon;
					//document.write(info);
					//WL.Logger.debug("Name: "+ name + ", INFO:" + info);
					
					$senicItem = $('<li><a href="#"><img src="'+icon+'" alt="'+name+'" /><h3>'+name+'</h3></a></li>');
//					$senicItem = $('<li><a href="#" id="'+name+'"></a></li>');
					$senicItem.appendTo($seniclist);
//
//					
//					$senicItemBtn = $('#'+name);
//					
//					$senicItemBtnImg = $('<img />').attr({ src: icon});
//					$senicItemBtnTitle = $('<h3>'+name+'</h3>');
//					
//					$senicItemBtnImg.appendTo($senicItemBtn);
//					$senicItemBtnTitle.appendTo($senicItemBtn);					
				}
				
			}
		},
		onFailure : function(result) {
			WL.Logger.error("Scenic retrieve failure");
		}
	});
}
