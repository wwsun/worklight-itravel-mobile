/**
 * Created by Weiwei on 11/27/2014.
 */

function getLocation() {
    //verify the browser supports W3C geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
    } else {
        onGeoError(new Error("Browser doesn't support geolocation"));
    }
}

function onGeoSuccess (position) {
    var coordinates = position.coords;
    alert(coordinates.latitude + ", " + coordinates.longitude);
}

function onGeoError (error) {
    alert(error.message);
}

getLocation();