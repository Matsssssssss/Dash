const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click",()=>{
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link=>{
    link.addEventListener("click",()=>{
        navLinks.classList.remove("active");
    });

    menuToggle.addEventListener("click",()=>{
    navLinks.classList.toggle("active");
    menuToggle.textContent =
        navLinks.classList.contains("active")
        ? "✖"
        : "☰";
});
});

/*
//Map Localization
const map = L.map("iMap", {
    zoomControl:true,
    minZoom:9,
    maxZoom:18
    }
).setView([11.15,122.55],9);

//Lock to Panay Island Bounds
const panayBounds = L.latLngBounds(
    [10.30,121.70],   // Southwest
    [11.76,123.50]    // Northeast
);

map.setMaxBounds(panayBounds);
map.fitBounds(panayBounds);

//OSM integration
L.tileLayer(
    //"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    //"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    //"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    //"https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    //"https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    //"https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    {
        maxZoom:15,
        attribution:"© OpenStreetMap contributors"
    }
).addTo(map);

//boundary style
function defaultStyle() {
    return{
        color:"#000000b4",
        weight:0.5,
        fillColor:"#ffffff7c",
        fillOpacity:0.1
    };
}

//map interactivity
function highlight(e) {
    e.target.setStyle(
    {
        weight:1.5,
        color:"#f44336",
        fillColor:"#0b72da4d",
        fillOpacity:0.5
    });
}

function reset(e) {
    geoJSON.resetStyle(e.target);
}

let geoJSON;

//municipal boundaries from rukku "github" repository
fetch("data/iloilo.geojson")
    .then(response => response.json())
    .then(data=>{

        geoJSON = L.geoJSON(data, {
            style: defaultStyle(),

            //calling the map interactivity functions on each feature
            onEachFeature:function(feature,layer) {
                layer.bindTooltip(feature.properties.MUNICIPALI),
                {
                    permanent:true,
                    direction:"center",
                    className:"municipality-label"
                }
                layer.on(
                {
                    mouseover:highlight,
                    mouseout:reset
                });
            }
        }).addTo(map);
    });*/