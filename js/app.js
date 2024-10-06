window.addEventListener('DOMContentLoaded', function() {

  'use strict';

  var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  var callsign = "M0MJX";

  function success(pos) {
    var crd = pos.coords;
    var osLatLng = new LatLng(crd.latitude, crd.longitude);
    var osGrdRef = osLatLng.toOSRef();

    document.getElementById("callsign").value = callsign;
    document.getElementById("latdec").value = precisionRoundMod(crd.latitude, 6);
    document.getElementById("londec").value = precisionRoundMod(crd.longitude, 6);
    document.getElementById("latdms").value = getDMS(crd.latitude, 'lat');
    document.getElementById("londms").value = getDMS(crd.longitude, 'lon');
    document.getElementById("mdnhd").value = gridForLatLon(crd.latitude, crd.longitude);
    document.getElementById("osloc").value = osGrdRef.toSixFigureString();
    document.getElementById("oswab").value = osGrdRef.toSixFigureString().substring(0, 3) + osGrdRef.toSixFigureString().substring(5, 6);
  }

  function error(err) {
    document.write(`ERROR(${err.code}): ${err.message}`);
  }

  function truncate(n) {
    return n > 0 ? Math.floor(n) : Math.ceil(n);
  }
  
  function getDMS(dd, longOrLat) {
    let hemisphere = /^[WE]|(?:lon)/i.test(longOrLat)
    ? dd < 0 ? "W" : "E"
      : dd < 0 ? "S" : "N";
  
    const absDD = Math.abs(dd);
    const degrees = truncate(absDD);
    const minutes = truncate((absDD - degrees) * 60);
    const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(2);
  
    let dmsArray = [degrees, minutes, seconds, hemisphere];
    return `${dmsArray[0]}° ${dmsArray[1]}' ${dmsArray[2]}" ${dmsArray[3]}`;
  }

  function precisionRoundMod(number, precision) {
    var factor = Math.pow(10, precision);
    var n = precision < 0 ? number : 0.01 / factor + number;
    return Math.round( n * factor) / factor;
  }

  function latLonToOS(lat, lon){
    const wgs84 = new LatLon(lat, lon);
    const gridRef = wgs84.toOsGrid();
    return gridRef.toString();
  }

  function getCallsign() {
    let text = prompt("Please enter the callsign:", callsign);
    if (text != null) {
      callsign = text;
    }
    document.getElementById("callsign").value = callsign;
  }

  function setTime() {
    let currDate = new Date();
    const formattedTime = pad0(currDate.getUTCHours(), 2)+ ":" + pad0(currDate.getUTCMinutes(), 2) + ":" + pad0(currDate.getUTCSeconds(), 2);
    document.getElementById("utctime").value = formattedTime;
  }

  function pad0(num, size){
    let numStr = num.toString();
    while (numStr.length < size) {
      numStr = "0" + numStr;
    }
    return numStr;
  }

  function callForAd() {
    getKaiAd({
      publisher: '75785d8a-c856-4c50-be4c-0e815b477daf',
      app: 'Ham QTH',
      test: 1, // 1 for test 0 for prod
      timeout: 5000,

      h: 264,
      w: 240,
    
      // Max supported size is 240x264
      // container is required for responsive ads
      container: document.getElementById('ad-container'),
    
      onerror: err => console.error('Custom catch:', err),
      onready: ad => {
        // Ad is ready to be displayed
        // calling 'display' will display the ad
        ad.call('display')
      }
    })  
  }

  setInterval(setTime, 1000);
  callForAd();
  // setInterval(callForAd, 60000);
  // getCallsign();
  navigator.geolocation.watchPosition(success, error, options);

});
