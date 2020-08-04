

var apiKey = "pk.eyJ1IjoiYmthcHNhbGlzIiwiYSI6ImNrMzg2OTZnMzA0bTMzaW5yMWhyb2hxN3AifQ.LCoY1nACfyPGDfOOP7C5hg";

var graymap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {

  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,

  id: "mapbox/light-v10",
  
  accessToken: apiKey
});

var satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {


  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,


  id: "mapbox/satellite-streets-v11",


  accessToken: apiKey
});

var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {


  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,

  id: "mapbox/outdoors-v11",
  



  accessToken: apiKey
});

var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 4,
  layers: [graymap, satellitemap, outdoors]
});

graymap.addTo(map);

var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

var baseMaps = {
  Satellite: satellitemap,
  Grayscale: graymap,
  Outdoors: outdoors
};
var overlays = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes
};

L
  .control
  .layers(baseMaps, overlays)
  .addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#581845";
    case magnitude > 4:
      return "#900C3F";
    case magnitude > 3:
      return "#C70039";
    case magnitude > 2:
      return "#FF5733";
    case magnitude > 1:
      return "#FFC300";
    default:
      return "#DAF7A6";
    }
  }

  
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }


  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      console.log(feature)
      console.log(latlng)


      return L.circleMarker(latlng);
    },
    style: styleInfo,

    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);

  var epic = L.control({
    position: "bottomright"
  });

  epic.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info epic");

    var Level = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#DAF7A6",
      "#FFC300",
      "#FF5733",
      "#C70039",
      "#900C3F",
      "#581845"
    ];

    for (var a = 0; a < Level.length; a++) {
      div.innerHTML += "<i style='background: " + colors[a] + "'></i> " +
        Level[a] + (Level[a + 1] ? "&ndash;" + Level[a + 1] + "<br>" : "+");
    }
    return div;
  };

  epic.addTo(map);

  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {

      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);

  
      tectonicplates.addTo(map);
    });
});
