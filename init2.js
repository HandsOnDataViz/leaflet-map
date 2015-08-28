// simplified
var map = L.map('map', {
  center: [41.76, -72.69],
  zoom: 13
});

var controlLayers = L.control.layers( null, null, {
  position: "bottomright",
  collapsed: false
}).addTo(map);

var lightAll = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

var popupHTML = function(photo){
  var result = "";
      result = '<strong>'+photo.title+'</strong><br>';
      result += '<a href="'+photo.url_m+'" target="_blank">';
      result += '<img src="'+photo.url_s+'"></a>';      //was url_t; want url_s; can change to url_m if desired, but frame needs work
      result += '<small>click image to enlarge in new tab</small>';
      return result;
}

var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=25dcc9a8c7410551dcb0af48c778bde5&user_id=56513965%40N06&tags=bikemap&extras=geo%2Curl_t%2Curl_s%2Curl_m%2Ctitle&format=json&nojsoncallback=1";
$.getJSON(flickrURL, function (data){
    for (var i = 0; i < data.photos.photo.length; i++){
      var photo_obj = data.photos.photo[i];
      marker = new L.marker([photo_obj.latitude, photo_obj.longitude])
      .bindPopup(popupHTML(photo_obj)).addTo(map);
    }
  controlLayers.addOverlay(marker, 'Flickr photos - broken button only toggles one image');
});
