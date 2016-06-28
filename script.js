// Template by http://github.com/jackdougherty/leaflet-map/
// See Leaflet tutorial links in README.md

// set up the map center and zoom level
var map = L.map('map', {
  center: [41.76, -72.67], // [41.5, -72.7] for Connecticut; [41.76, -72.67] for Hartford county or city
  zoom: 13, // zoom 9 for Connecticut; 10 for Hartford county, 12 for Hartford city
  zoomControl: false, // add later to reposition
  scrollWheelZoom: false
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

// REMOVE AFTER MAP CONSTRUCTION: optional Zoom Label (also in index.html)
L.control.zoomLabel().addTo(map);

// Reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map);

// REMOVE AFTER MAP CONSTRUCTION: optional Coordinate Control (also in index.html)
var c = new L.Control.Coordinates();
c.addTo(map);
map.on('click', function(e) {
    c.setCoordinates(e);
});

/* BASELAYERS */
// use common baselayers below, delete, or add more with plain JavaScript from http://leaflet-extras.github.io/leaflet-providers/preview/
// .addTo(map); -- suffix displays baselayer by default
// controlLayers.addBaseLayer (variableName, 'label'); -- adds baselayer and label to legend; omit if only one baselayer with no toggle desired
var lightAll = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(lightAll, 'CartoDB LightAll');

var lightNoLabels = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(lightNoLabels, 'CartoDB Light no labels');

var darkAll = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(darkAll, 'CartoDB DarkAll');

var darkNoLabels = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(darkNoLabels, 'CartoDB Dark no labels');

// Esri satellite map from http://leaflet-extras.github.io/leaflet-providers/preview/
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
controlLayers.addBaseLayer(Esri_WorldImagery, 'Esri World Imagery');

// MapQuest satellite map from http://leaflet-extras.github.io/leaflet-providers/preview/
var MapQuestOpen_Aerial = L.tileLayer('https://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
  type: 'sat',
  ext: 'jpg',
  attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
  subdomains: '1234'
});
controlLayers.addBaseLayer(MapQuestOpen_Aerial, 'MapQuest Open Aerial');

// tileLayer.WMS as a baselayer - see http://leafletjs.com/reference.html#tilelayer-wms
// UConn MAGIC WMS settings - see http://geoserver.lib.uconn.edu:8080/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage
var aerial1934 = new L.tileLayer.wms("https://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:1934 Connecticut Aerial Photography',
  attribution: '1934 <a href="http://magic.library.uconn.edu">MAGIC UConn</a> and <a href="http://cslib.org">CSL</a>'
}).addTo(map); // adds layer by default
controlLayers.addBaseLayer(aerial1934, 'CT Aerial 1934');

// tileLayer.WMS as a baselayer - see http://leafletjs.com/reference.html#tilelayer-wms
// UConn MAGIC WMS settings - see http://geoserver.lib.uconn.edu:8080/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage
var hartfordCounty1855 = new L.tileLayer.wms("https://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:HartfordCounty_Woodford_1855',
  format: 'image/png',
  version: '1.1.0',
  transparent: true,
  attribution: '1855 <a href="http://magic.library.uconn.edu">MAGIC UConn</a>'
});
controlLayers.addBaseLayer(hartfordCounty1855, 'Hartford County 1855');

/* POINT OVERLAYS */
// ways to load point map data from different sources: coordinates in the code, GeoJSON in local directory, remote GeoJSON and JSON

// load one point from coordinates in code, icon from local directory, no interactive legend button
// places a star on state capital of Hartford, CT
// * TO DO: test whether placement of this code affects its display order, on top of other icons?
var starIcon = L.icon({
  iconUrl: 'src/star-18.png',
  iconRetinaUrl: 'src/star-18@2x.png',
  iconSize: [18, 18]
});
L.marker([41.764, -72.682], {icon: starIcon}).addTo(map);

// load point geojson data from local directory, using jQuery function (symbolized by $)
// modify icon source and styling
// modify pointToLayer marker bindPopup function to display GeoJSON data in info window
// option to insert '.addTo(map)' to display layer by default
// insert controlLayers.addOverlay(geoJsonLayer, 'InsertYourTitle') to add to legend


// load GeoJSON point data and clickable circles from local directory
$.getJSON("src/points.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var circle = L.circleMarker(latlng, {
        radius: 8,
        fillColor: "#ccccff",
        color: "#0000cc",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      });
      circle.bindPopup(feature.properties.Location); // replace 'Location' with properties data label from your GeoJSON file
      return circle;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Circles');
});

// load GeoJSON point data and clickable icons from local directory, using jQuery function (symbolized by $)
$.getJSON("src/points.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/hospital-18.png",
    iconRetinaUrl: 'src/hospital-18@2x.png',
    iconSize: [18, 18]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.Location); // replace 'Location' with properties data label from your GeoJSON file
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Hospitals');
});

// Flickr photo overlay from remote JSON API feed, such as all Flickr public photos OR only from your account
// Obtain and insert your own flickr API key
// https://www.flickr.com/services/apps/create/
// Use Flickr API explorer to obtain correct endpoint
// https://www.flickr.com/services/api/explore/?method=flickr.photos.search
// Example shows photos.search of georeferenced images using keyword tags
// https://www.flickr.com/services/api/explore/flickr.photos.search

// Define flickrURL endpoint with API explorer: insert your key, and tags= or text= to filter results
var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=25dcc9a8c7410551dcb0af48c778bde5&user_id=56513965%40N06&tags=bikemap&extras=geo%2Curl_t%2Curl_s%2Curl_m%2Ctitle&format=json&nojsoncallback=1";

// Define the flickr popup display
// ** TO DO: Rewrite link to view original source photo directly on Flickr
// ** POSSIBLY include this code directly in the functions below for easier sequencing by novices
var popupHTML = function(photo){
  var result = "";
      result = '<strong>'+photo.title+'</strong><br>';
      result += '<a href="'+photo.url_m+'" target="_blank">';
      result += '<img src="'+photo.url_s+'"></a>';      //was url_t; want url_s; can change to url_m if desired, but frame needs work
      result += '<small>click image to enlarge in new tab</small>';
      return result;
}
// Load photos from flickr JSON feed (insert your flickrURL above), display with clickable blue markers
$.getJSON(flickrURL, function (data) {
  // Create new layerGroup for the markers, with option to append ".addTo(map);" to display by default
  var layerGroup = new L.LayerGroup();
  // Add layerGroup to your layer control and insert your label to appear in legend
  controlLayers.addOverlay(layerGroup, 'Flickr photo blue markers'); // Insert your own legend label
  // Start a loop to insert flickr photo data into photoContent
  for (var i = 0; i < data.photos.photo.length; i++) {
    var photoContent = data.photos.photo[i];
    var marker = new L.marker([photoContent.latitude, photoContent.longitude]);
    marker.bindPopup(popupHTML(photoContent));
    // Add the marker to the layerGroup
    marker.addTo(layerGroup);
  }
});

// Load photos from flickr JSON (insert your flickrURL above), display with clickable photo thumbnails
$.getJSON(flickrURL, function (data) {
  // Create new layerGroup for the markers, with option to append ".addTo(map);" to display by default
  var layerGroup = new L.LayerGroup().addTo(map);
  // Add layerGroup to your layer control and insert your label to appear in legend
  controlLayers.addOverlay(layerGroup, 'Flickr photo thumbnail icons');
  // Start a loop to insert flickr photo data into photoContent
  for (var i = 0; i < data.photos.photo.length; i++) {
    var photoContent = data.photos.photo[i];
    var photoIcon = L.icon(
      {iconUrl: photoContent.url_t,
      iconSize: [photoContent.width_t * 0.5, photoContent.height_t * 0.5]}  //reduces thumbnails 50%
    );
    var marker = new L.marker([photoContent.latitude, photoContent.longitude], {icon: photoIcon});
    marker.bindPopup(popupHTML(photoContent));
    // Add the marker to the layerGroup
    marker.addTo(layerGroup);
  }
});


/* POLYGON and POLYLINE OVERLAYS */
// Ways to load geoJSON polygon layers from local directory or remote server
// Different options for styling and interactivity

// load GeoJSON polyline data
$.getJSON("src/bus-routes.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'red',
        'weight': 2,
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.LineName) // change to match your geojson property labels
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Bus Routes');  // insert your 'Title' to add to legend
});

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

// load polygon geojson, using data to define fillColor, from local directory
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
