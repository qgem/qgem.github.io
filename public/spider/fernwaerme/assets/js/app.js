// Init F7 Vue Plugin
Framework7.use(Framework7Vue);


// Init App
var vue = new Vue({
  el: '#app',
  data: function () {
    return {
      // Framework7 parameters here
      f7params: {
        root: '#app', // App root element
        id: 'mobile.gemspider.at', // App bundle ID
        name: 'gemspider', // App name
        theme: 'auto', // Automatic theme detection
        routes: [],
        panel: {
          swipe: 'left',
          swipeActiveArea: 15,
          leftBreakpoint: 0
        }
      },
      file: '',
      showPreview: false,
      imagePreview: '',
      baseMap: 'basemap-normal',
      pitch: 0,
      vectorLayers: {
        kanal: false,
        wasser: false,
        beleuchtung: false,
        gas: false,
        fernwaerme: true,
        buildings: false,
        dkm: false
      },
      selectedElement: {properties: {} }
    }
  },
  created() {
    console.log(this.basemap)
  },
  mounted() {
    this.createMap();
  },

  methods: {
    createMap() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoic2hvbmdvbG9sbyIsImEiOiJjamVoN25yYTQxMXBwMzNuc2ZkeGk5eGtzIn0.ZQNxwHhtZDBfsVNjDL0c7A';
      this.map = new mapboxgl.Map({
        container: 'map',
        style: window.location.origin + '/public/spider/fernwaerme/mapbox-style.json',
        center: [13.1912,47.469996], 
        zoom: 17,
      });
      let map = this.map;
      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(new mapboxgl.FullscreenControl());
      map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }}));
      this.$f7.preloader.show();
      map.on('style.load', () => {  // https://stackoverflow.com/questions/44394573/mapbox-gl-js-style-is-not-done-loading
        const waiting = () => {
          if (!map.isStyleLoaded()) {
            setTimeout(waiting, 250);
          } else {
            this.$f7.preloader.hide();
            this.loadMyLayers();
          }
        };
        waiting();
      });
      map.resize();
    },
    loadMyLayers() {
      // Buildings
      var buildings = {
        "id": "building-3d",
        "type": "fill-extrusion",
        "metadata": {},
        "source": {
            type: "vector",
            tiles: [window.location.origin + '/services/tile-server/osm-austria/{z}/{x}/{y}.mvt'],
            maxzoom: 14
        },
        "source-layer": "building",
        "minzoom": 14,
        "paint": {
          "fill-extrusion-color": "hsl(35, 8%, 85%)",
          "fill-extrusion-height": {
            "property": "render_height",
            "type": "identity"
          },
          "fill-extrusion-base": {
            "property": "render_min_height",
            "type": "identity"
          },
          "fill-extrusion-opacity": 0.75
        },
        "layout": {
          "visibility": "none"
        }
      };         
      this.map.addLayer(buildings);

    
      // DKM
      var dkm = {
          "id": "dkm",
          "source": {
              'type': 'raster',
              'tiles': [window.location.origin + '/services/tile-server/GeoServer/Interceptor/Wms/CP/INSPIRE_KUNDEN_ID?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=3&STYLES=&FORMAT=image/png&TRANSPARENT=true&HEIGHT=256&WIDTH=256&SRS=EPSG:3857&BBOX={bbox-epsg-3857}'],
              'tileSize': 256
          },
          "type": "raster",
          "minzoom": 15,
          "maxzoom": 22,
          "paint": {
          },
          'layout': {
              'visibility': "none"
          },
          "interactive": true
      }
      this.map.addLayer(dkm);

        
      let self = this;
      let map = this.map;
      var fieldNamesMaste = ["Anlagennr","Anlagenbez", "KnoArt", "ProtuArt","Kennziffer","Gemeinde","Ortsteil","Haltungsnr", "Strasse", "Grundparz", "ObjZugehoe", "Zustaekeit"];
      map.on('click', 'fernwaerme_knoten', openPopup)
      map.on('click', 'fernwaerme_label', openPopup);
      function openPopup(e) {
        self.selectedElement = e.features[0];
        var propsHtml = '';
        fieldNamesMaste.forEach(function (name) {
          propsHtml += '<strong>' + name + ':</strong> ' + e.features[0].properties[name] + '<br>' 
        });
        self.popup = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<h1>Anlagennr: ' + e.features[0].properties['Anlagennr'] + '</h1><div style="width: 200px; height: 300px; overflow-y: auto;">' + propsHtml + 
          '<br><a href="#" data-popup="#sichtkontrolle" class="button button-round button-fill popup-open">Sichtkontrolle</a></div>' )
          .addTo(map);
      }  
    },
    switchLayerVisibility(layer, visibility) {
      this.map.setLayoutProperty(layer, 'visibility',  (visibility ? 'visible' : 'none'));
    },
    addMarker() {
      let self = this;
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(./assets/img/marker-icon-blue.png)';
      el.style.width = '25px';
      el.style.height = '41px';
      el.addEventListener('click', function() {
        self.$f7.popup.open(document.getElementById('sichtkontrolle'), true);
      });
      new mapboxgl.Marker(el, {offset: [-0, -20]})
        .setLngLat(this.selectedElement.geometry.coordinates)
        .addTo(this.map);
      this.popup.remove();
      this.imagePreview = '';
      this.file = '';
    },

    handleFileUpload(refName){
      this.file = this.$refs.file.files[0];
      let reader  = new FileReader();
      reader.addEventListener("load", function () {
        this.showPreview = true;
        this.imagePreview = reader.result;
      }.bind(this), false);
      if( this.file ){
        if ( /\.(jpe?g|png|gif)$/i.test( this.file.name ) ) {
          reader.readAsDataURL( this.file );
        }
      }
    },
    changePitch(value) {
      this.pitch = value;
      this.map.setPitch(value);
    }
      
  },
  watch: {
    baseMap: {
      handler(value){
        this.map.setLayoutProperty('basemap-ortho', 'visibility',  (value === 'basemap-ortho' ? 'visible' : 'none'));
        this.map.setLayoutProperty('basemap-normal', 'visibility',  (value === 'basemap-normal' ? 'visible' : 'none'));
      }
    },
    'vectorLayers.beleuchtung':  function (newVal, oldVal){
      this.switchLayerVisibility('beleuchtung', newVal);
    },
    'vectorLayers.gas':  function (newVal, oldVal){
      this.switchLayerVisibility('gas', newVal);
    },
    'vectorLayers.kanal':  function (newVal, oldVal){
      this.switchLayerVisibility('kanal', newVal);
    },
    'vectorLayers.wasser':  function (newVal, oldVal){
      this.switchLayerVisibility('wasser', newVal);
    },
    'vectorLayers.buildings':  function (newVal, oldVal){
      this.switchLayerVisibility('building-3d', newVal);
    },
    'vectorLayers.dkm':  function (newVal, oldVal){
      this.switchLayerVisibility('dkm', newVal);
    }
  }
});

