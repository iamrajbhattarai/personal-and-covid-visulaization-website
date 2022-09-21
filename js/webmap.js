//1. lets create different layers to add for the map

// osm layer
var osmlayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: 'OSM',
});

// bing satellite layer
var bing = new ol.layer.Tile({   
  source: new ol.source.BingMaps({
    key: 'Al8ndH_tSrjQGgBTDzeRsN4v97ct11yzrS78nH4i5zn960SjjFRC9WlmBLIBtHzc',
    imagerySet: 'AerialWithLabelsOnDemand',        
  }),
  visible: false,
  title:'BingMaps',
});


//1.1 nepal boundary
countryWMS = new ol.layer.Image ({
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:country'},
    serverType: 'geoserver',
  }),
  visible: false,
});

//1.2 province boundary
provinceWMS = new ol.layer.Image ({
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:provincee'},
    serverType: 'geoserver',       
  }),
  visible: false,
});

//1.3 districts Layer
districtWMS = new ol.layer.Image ({  
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:districts'},
    serverType: 'geoserver',
  }),
  visible: false,
});

//1.4 local level layer
localWMS = new ol.layer.Image ({  
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:local'},
    serverType: 'geoserver',
  }),
  visible: false,
});

//1.5 male population
maleWMS = new ol.layer.Image ({  
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:distpopmale'},
    serverType: 'geoserver',
  }),
  visible: false,
});

//1.6 female population
femaleWMS = new ol.layer.Image ({  
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:distpopfemale'},
    serverType: 'geoserver',
  }),
  visible: false,
});

//1.7 total population
populationWMS = new ol.layer.Image ({  
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:distpop'},
    serverType: 'geoserver',
  }),
  visible: false,
});

//1.8landcover
landcoverWMS = new ol.layer.Image ({
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:Landcover'},
    serverType: 'geoserver',
  }),
  visible: false,
});

//1.9 SRTM DEM
srtmWMS = new ol.layer.Image ({
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/webgis/wms',
    params: {'LAYERS': 'webgis:NepalSRTM90m'},
    serverType: 'geoserver',
  }),
  visible: false,
});

//1.10 Covid Layer (My Interest Layer)
covidSource= new ol.source.ImageWMS({
  url: 'http://localhost:8080/geoserver/webgis/wms',
  params: {'LAYERS': 'webgis:covid'},
  serverType: 'geoserver',
});

covidWMS = new ol.layer.Image ({
  source: covidSource,
  visible: false,
  //opacity: 0.2,
});


//now creating the layer group and adding 
var layerGroup = new ol.layer.Group({
  layers: [
    osmlayer, bing, countryWMS, provinceWMS, districtWMS, localWMS, maleWMS, femaleWMS, populationWMS, landcoverWMS, srtmWMS, covidWMS,
  ]
});

view = new ol.View({
  projection: 'EPSG:4326',
  center: [84.1240, 28.3949],  //long and then lat.
  // center: ol.proj.fromLonLat([84.1240, 28.3949]),  
  zoom: 7      
});

//2. create a map object and assign basic parameters
var map = new ol.Map({
    target: 'webmap', 
    layers: [
      osmlayer,layerGroup
    ],
    view: view,
    // adding full screen and overview map controls to the map
    //controls: ol.control.defaults().extend([new ol.control.FullScreen(), overviewMapControl])
  });

//3.Now lets add a map and basic elements of the map

// add overview map 
const overviewMapControl = new ol.control.OverviewMap({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    })
  ],
  collapsed: false,
});
map.addControl(overviewMapControl);

//add full screen control
map.addControl(new ol.control.FullScreen());

// add scale bar to the map
var scaleline = new ol.control.ScaleLine({
  bar: true,
  steps: 4,
  minWidth: 100,
  target: document.getElementById('scale-line')
});
map.addControl(scaleline);

//display Coordinates of Map Area
var mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(4),
  projection: 'EPSG:4326',
  emptyString: 'Out of Map Area',
  className: 'display-coordinate',
  target: document.getElementById('display-coordinate'),
});
map.addControl(mousePositionControl);

//add default extent control
var extent = new ol.control.ZoomToExtent({
  // extent is bottom left and top right
  extent: [
    77.4942, 25.1436, 90.7217,
    31.6739,
  ],
})
map.addControl(extent);

//lets create a dictionary of legends with their links from geoserver
var legendDict = {
  'country':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:country",
  'province':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:provincee",
  'district':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:districts",
  'local':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:local",
  'male':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:distpopmale",
  'female':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:distpopfemale",
  'population':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:distpop",
  'landcover':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:Landcover",
  'dem':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:NepalSRTM90m",
  'covid':"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:covid",
};

// lets create a dictionary for titles.
var titleList = {
  'osm':"OSM BASEMAP ",
  'bing':"BING SATELLITE BASEMAP",
  'country': "COUNTRY MAP",
  'province': "PROVINCE MAP",
  'district':"DISTRICT MAP",
  'local':"LOCAL LEVEL MAP",
  'male':"MALE  POPULATION DISTRIBUTION  MAP",
  'female':"FEMALE POPULATION DISTRIBUTION MAP",
  'population':"POPULAITON  DISTRIBUTION  MAP",
  'landcover':"LANDCOVER  MAP",
  'dem':"SRTM  DIGITAL  ELEVATION  MAP",
  'covid':"COVID  CASES  DISTRIBUTION  MAP (getFeatureInfo Included)",
};


//logic for functioning of TOC, kegend and title

function bindInputs(layerid, layer) {
  console.log(layerid);
  const visibilityInput = $(layerid + ' input.visible');
  console.log(visibilityInput);
  visibilityInput.on('change', function () {
    layer.setVisible(this.checked);
    console.log(this.checked);

    //get the name of the legend of the checked layer
    var legendDisp = $(this).attr('legend');    
    console.log(legendDisp);

    //change the legend as per the selection of the layer
    $( "#change" ).attr("src", legendDict[legendDisp]);

    //change the title of the map as per the layer selected
    $( "#title" ).text(titleList[legendDisp]);

    //if covid selected then only achieve getFeatureInfo
    if( legendDisp == "covid") {getInfo()};

  });
  visibilityInput.prop('checked', layer.getVisible());

  const opacityInput = $(layerid + ' input.opacity');
  opacityInput.on('input', function () {
    layer.setOpacity(parseFloat(this.value));
  });
  opacityInput.val(String(layer.getOpacity()));
}
function setup(id, group) {
  group.getLayers().forEach(function (layer, i) {
    const layerid = id + i;
    bindInputs(layerid, layer);
    if (layer instanceof ol.layer.Group) {
      setup(layerid, layer);
    }
  });
}
setup('#layer', layerGroup);

$('#layertree li > span')
  .click(function () {
    $(this).siblings('fieldset').toggle();
  })
  .siblings('fieldset')
  .hide();


//getFeatureInfo for covid layer
//since CORS blocks to retrieve contents between two different origins. we have two option to achieve getFeatureInfo..
//1. Use proxy.
//2. Place your project inside geoserver and host your project from geoserver. This enables to run both your JS and server in a single port so that your origin becomes same.

// I used the second method.

function getInfo(){  
  map.on('singleclick', function (evt) {
    document.getElementById('info').innerHTML = '';
    const viewResolution = (view.getResolution());
    //console.log(viewResolution);
    const url = covidSource.getFeatureInfoUrl(
      evt.coordinate,
      viewResolution,
      'EPSG:4326',
      {'INFO_FORMAT': 'text/html'}
    );
    
    //console.log('this is url: '+url);
    if (url) {
      fetch(url)          
        .then((response) => response.text())
        .then((html) => {
          document.getElementById('info').innerHTML = html;
        });
    }
  });

  map.on('pointermove', function (evt) {
    if (evt.dragging) {
      return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    const hit = map.forEachLayerAtPixel(pixel, function () {
      return true;
    });
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });
}