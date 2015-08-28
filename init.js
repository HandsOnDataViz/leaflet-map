// Template by http://github.com/jackdougherty/leaflet-map/
// See Leaflet tutorial links in README.md

// set up the map center and zoom level
var map = L.map('map', {
  center: [41.5, -72.7], // [41.5, -72.7] for Connecticut; [41.76, -72.67] for Hartford county or city
  zoom: 9, // zoom 9 for Connecticut; 10 for Hartford county, 12 for Hartford city
  zoomControl: false // add later to reposition
});

// optional : customize link to view source code; add your own GitHub repository
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

// optional: add legend to toggle any baselayers and/or overlays
// global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "bottomright", // suggested: bottomright for CT (in Long Island Sound); topleft for Hartford region
  collapsed: false // false = open by default
}).addTo(map);

// optional: reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map);


/* BASELAYERS */
// use common baselayers below, delete, or add more with plain JavaScript from http://leaflet-extras.github.io/leaflet-providers/preview/
// .addTo(map); -- suffix displays baselayer by default
// controlLayers.addBaseLayer (variableName, 'label'); -- adds baselayer and label to legend; omit if only one baselayer with no toggle desired
var lightAll = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map); //this displays layer by default
controlLayers.addBaseLayer(lightAll, 'CartoDB LightAll');

var lightNoLabels = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(lightNoLabels, 'CartoDB Light no labels');

var darkAll = new L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(darkAll, 'CartoDB DarkAll');

var darkNoLabels = new L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(darkNoLabels, 'CartoDB Dark no labels');

// Esri satellite map from http://leaflet-extras.github.io/leaflet-providers/preview/
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
controlLayers.addBaseLayer(Esri_WorldImagery, 'Esri World Imagery');

// MapQuest satellite map from http://leaflet-extras.github.io/leaflet-providers/preview/
var MapQuestOpen_Aerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
  type: 'sat',
  ext: 'jpg',
  attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
  subdomains: '1234'
});
controlLayers.addBaseLayer(MapQuestOpen_Aerial, 'MapQuest Open Aerial');

// tileLayer.WMS as a baselayer - see http://leafletjs.com/reference.html#tilelayer-wms
// UConn MAGIC WMS settings - see http://geoserver.lib.uconn.edu:8080/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage
var aerial1934 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:1934 Connecticut Aerial Photography',
  format: 'image/png',
  version: '1.1.0',
  transparent: true,
  attribution: '1934 <a href="http://magic.library.uconn.edu">MAGIC UConn</a> and <a href="http://cslib.org">CSL</a>'
});
controlLayers.addBaseLayer(aerial1934, 'CT Aerial 1934');

/* POINT OVERLAYS */

// load one point from code coordinates, icon from local directory, no interactive legend button
// places a star on state capital of Hartford, CT, (visible at all times? **TEST**)
var starIcon = L.icon({
  iconUrl: 'src/star-18.png',
  iconRetinaUrl: 'src/star-18@2x.png',
  iconSize: [18, 18]
});
L.marker([41.764, -72.682], {icon: starIcon}).addTo(map);

// REORGANIZE TEXT
// load point geojson data from local directory, using jQuery function (symbolized by $)
// modify style (for appearance) and onEachFeature (for popup windows or hover info)
// insert '.addTo(map)' to display layer by default
// insert controlLayers.addOverlay(geoJsonLayer, 'InsertYourTitle') to add to legend

// load geojson points and clickable icons from local directory
$.getJSON("src/points.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/hospital-18.png",
    iconRetinaUrl: 'src/hospital-18@2x.png',
    iconSize: [18, 18]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.Location);
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Hospitals');
});

// load geoJson markers from remote API feed: USGS earthquakes
// http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
var geoJsonURL = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
$.getJSON(geoJsonURL, function (data) {
  var geoJsonLayer = L.geoJson(data, {
    onEachFeature: function( feature, layer) {
      var popupText = "Magnitude: " + feature.properties.mag
         + "<br>Location: " + feature.properties.place
         + "<br><a href='" + feature.properties.url + "'>More info</a>";
      layer.bindPopup(popupText);
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'USGS Earthquakes (zoom out)');  // insert your 'Title' to add to legend
});

//TESTING Flickr photo overlay (items display, but button is not working)
//Use Flickr API explorer to obtain correct endpoint and insert your own API key
//Photos.search currently works, but error with photosets.getPhotos
//https://www.flickr.com/services/api/explore/flickr.photos.search
//https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos

// added url_s
var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=25dcc9a8c7410551dcb0af48c778bde5&user_id=56513965%40N06&tags=bikemap&extras=geo%2Curl_t%2Curl_s%2Curl_m%2Ctitle&format=json&nojsoncallback=1";
//This returns error
//var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=25dcc9a8c7410551dcb0af48c778bde5&photoset_id=72157646371103550&extras=geo%2Curl_t%2Curl_m&format=json&nojsoncallback=1";

// this is improved output
var popupHTML = function(photo){
  var result = "";
      result = '<strong>'+photo.title+'</strong><br>';
      result += '<a href="'+photo.url_m+'" target="_blank">';
      result += '<img src="'+photo.url_s+'"></a>';      //was url_t; want url_s; can change to url_m if desired, but frame needs work
      result += '<small>click image to enlarge in new tab</small>';
      return result;
}
// TEST #1 trying to modify this $.ajax flickr function that originally worked in bikemapcode
$.ajax({
  url: flickrURL,
  dataType: 'json',
  success: function(data){
    for (var i = 0; i < data.photos.photo.length; i++){
      var photo_obj = data.photos.photo[i];
      var photo_icon = L.icon(
        {iconUrl: photo_obj.url_t,
        iconSize: [photo_obj.width_t * 0.5, photo_obj.height_t * 0.5]}  //reduces thumbnails 50%
      );

      var flickrPhotos = new L.marker([photo_obj.latitude, photo_obj.longitude], {icon: photo_icon})
      // .bindPopup(popupHTML(photo_obj)).addTo(map);
      .bindPopup(popupHTML(photo_obj));
    }
  controlLayers.addOverlay(flickrPhotos, 'Flickr photos (broken button)'); //THIS IS the problem line
  }
});

// ERASE DUPLICATE later
// $.getJSON("src/points.geojson", function (data){
//   var iconStyle = L.icon({
//     iconUrl: "src/hospital-18.png",
//     iconRetinaUrl: 'src/hospital-18@2x.png',
//     iconSize: [18, 18]
//   });
//   var geoJsonLayer = L.geoJson(data, {
//     pointToLayer: function( feature, latlng) {
//       var marker = L.marker(latlng,{icon: iconStyle});
//       marker.bindPopup(feature.properties.Location);
//       return marker;
//     }
//   }); // insert ".addTo(map)" to display layer by default
//   controlLayers.addOverlay(geoJsonLayer, 'Hospitals');
// });

// TEST #3 trying to modify this $.ajax flickr function that originally worked in bikemapcode
// modifying with pointToLayer approach from http://maptimeboston.github.io/leaflet-intro/
// $.ajax({
//   url: flickrURL,
//   dataType: 'json',
//   success: function(data){
//   for (var i = 0; i < data.photos.photo.length; i++){
//     var photo_obj = data.photos.photo[i];
//     var iconStyle = L.icon({
//       iconUrl: photo_obj.url_t,
//       iconSize: [photo_obj.width_t * 0.5, photo_obj.height_t * 0.5]  //reduces thumbnails 50%
//     });
//     var flickrLayer = L.geoJson(data, {
//       pointToLayer: function(feature,latlng) {
//         var marker = L.marker([photo_obj.latitude, photo_obj.longitude], {icon: iconStyle});
//         marker.bindPopup(popupHTML(photo_obj));
//         return marker;
//       }
//     }); // insert ".addTo(map)" to display layer by default
//     controlLayers.addOverlay(geoJsonLayer, 'Flickr testing');
//     }
//   }
// });

/* POLYGON OVERLAYS */

// load polygon data with clickable features from local directory
$.getJSON("src/polygons.geojson", function (data) {   // insert pathname to your local directory file
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'red',
        'weight': 2,
        'fillColor': '#fff',
        'fillOpacity': 0.2
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.Town) // change 'Town' to match your geojson property labels
    }
  }).addTo(map);  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Polygons (CT towns)');  // insert your 'Title' to add to legend
});

// load polygon geojson, with more complex styling, from local directory
// *TO DO* rebuild file for pop density
// *TO DO* change from click to hover, and add legend to display colors and hover data
$.getJSON("src/polygons.geojson", function (data) {   // insert pathname to your local directory file
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      var fillColor,
        population = feature.properties.Pop2010;
      if (population > 100000) fillColor = "#006837";
      else if (population > 50000) fillColor ="#31a354";
      else if (population > 15000) fillColor ="#78c679";
      else if (population > 5000) fillColor ="#c2e699";
      else if (population > 0) fillColor ="#ffffcc";
      else fillColor = "#f7f7f7"; // no data
      return {
        'color': 'red',
        'weight': 2,
        'fillColor': fillColor, // sorts by method above
        'fillOpacity': 0.8
      }
    },
    onEachFeature: function( feature, layer) {
      var popupText = "<b>" + feature.properties.Town + "</b>"   // replace labels with those from your own geojson
         + "<br>Population 2010: " + "<br>" + feature.properties.Pop2010;
      layer.bindPopup(popupText);
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Polygons filled (CT Pop 2010)');  // insert your 'Title' to add to legend
});
