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
    [10.37, 121.2],   // Southwest
    [11.80, 123.60]    // Northeast
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
        attribution:"© Humanitarian OpenStreetMap Team"
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
    });

//vehicle layer on map
const trackStarVehicleLayer = L.layerGroup();
trackStarVehicleLayer.addTo(map);

//refresh TrackStar vehicles every 30 seconds
// TRACKSTAR AUTO UPDATE CONFIGURATION
const TRACKSTAR_UPDATE_INTERVAL = 10000; // 30 seconds
let trackStarUpdateTimer = null;

// Store existing markers by vehicle ID
const trackStarMarkers = new Map();
let trackStarUpdating = false;

console.log(
    "IMAP:",
    map
);

console.log(
    "TRACKSTAR LAYER:",
    trackStarVehicleLayer
);

const TRACKSTAR_API_URL = "https://script.google.com/macros/s/AKfycby7y--gdqulGFIkl3GVuI5nfou4Fb_ISjxwL-ZTqK5BCvgTlEhdv1Cq16dql_b23j6J/exec";

async function fetchTrackStarVehicles() {
    try {

        console.log("========================================");
        console.log("TRACKSTAR API REQUEST");
        console.log("========================================");

        const response =
            await fetch(TRACKSTAR_API_URL);

        if (!response.ok) {
            throw new Error(
                "API HTTP error: " +
                response.status
            );
        }

        const data =
            await response.json();

        console.log(
            "TRACKSTAR API RESPONSE:",
            data
        );


        // Validate API response
        if (!data.success) {
            throw new Error(
                data.error ||
                "TrackStar API returned success=false"
            );
        }

        if (!Array.isArray(data.vehicles)) {
            throw new Error(
                "TrackStar API returned an invalid vehicles array."
            );

        }

        console.log (
            "VEHICLES RECEIVED:",
            data.vehicles.length
        );
        return data.vehicles;
    } 

    catch (error) {
        console.error(
            "TRACKSTAR API ERROR:",
            error
        );
        return [];
    }
}

// CREATE VEHICLE MARKER
function createTrackStarMarker(vehicle) {

    if (
        vehicle.lat === null ||
        vehicle.lng === null ||
        vehicle.lat === undefined ||
        vehicle.lng === undefined
    ) {

        console.warn(
            "Vehicle has no valid coordinates:",
            vehicle
        );

        return null;
    }

    const marker =
        L.marker([
            Number(vehicle.lat),
            Number(vehicle.lng)
        ]);

    marker.bindPopup(`
        <div class="trackstar-popup">
            <strong>
                ${vehicle.objectName || "Unknown Vehicle"}
            </strong>

            <br>

            <span>
                ${vehicle.vehicleType || ""}
            </span>

            <hr>

            <strong>Status:</strong>
            ${vehicle.status || "Unknown"}

            <br>

            <strong>Speed:</strong>
            ${vehicle.speed || 0} km/h

            <br>

            <strong>Driver:</strong>
            ${vehicle.driver || "N/A"}

            <br>

            <strong>GPS:</strong>
            ${vehicle.gps || "Unknown"}

            <br>

            <strong>Contact:</strong>
            ${vehicle.simCardNo || "Unknown"}

            <br>

            <strong>Location:</strong>
            ${vehicle.location || "Unknown"}
        </div>
    `);
    return marker;
}


// UPDATE EXISTING TRACKSTAR MARKER
function updateTrackStarMarker(marker, vehicle) {

    if (!marker || !vehicle) {
        return;
    }

    const lat = Number(vehicle.lat);
    const lng = Number(vehicle.lng);

    // Validate coordinates
    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        console.warn(
            "Invalid coordinates for vehicle:",
            vehicle.objectName
        );
        return;
    }

    // Move marker
    marker.setLatLng([
        lat,
        lng
    ]);

    // Update popup
    marker.setPopupContent(`
        <div class="trackstar-popup">

            <strong>
                ${vehicle.objectName || "Unknown Vehicle"}
            </strong>

            <br>

            <span>
                ${vehicle.vehicleType || ""}
            </span>

            <hr>

            <strong>Status:</strong>
            ${vehicle.status || "Unknown"}

            <br>

            <strong>Speed:</strong>
            ${vehicle.speed || 0} km/h

            <br>

            <strong>Driver:</strong>
            ${vehicle.driver || "N/A"}

            <br>

            <strong>GPS:</strong>
            ${vehicle.gps || "Unknown"}

            <br>

            <strong>Contact:</strong>
            ${vehicle.simCardNo || "Unknown"}

            <br>

            <strong>Location:</strong>
            ${vehicle.location || "Unknown"}

            <br>

            <strong>Updated:</strong>
            ${vehicle.actualTime || "Unknown"}

        </div>
    `);
}

//show all vehicles on map
// UPDATE ALL TRACKSTAR VEHICLES
async function updateAllTrackStarVehicles() {
    // Prevent overlapping API requests
    if (trackStarUpdating) {

        console.log(
            "TrackStar update already running."
        );

        return;
    }

    trackStarUpdating = true;

    try {

        console.log(
            "========================================"
        );

        console.log(
            "TRACKSTAR AUTOMATIC UPDATE"
        );

        console.log(
            "========================================"
        );

        // Fetch latest vehicle data
        const vehicles =
            await fetchTrackStarVehicles();

        if (!Array.isArray(vehicles)) {

            console.warn(
                "TrackStar API did not return an array."
            );
            return;
        }

        console.log(
            "VEHICLES RECEIVED:",
            vehicles.length
        );

        // Track vehicles returned by API
        const activeVehicleIds = new Set();

        // Process every vehicle
        vehicles.forEach(function(vehicle) {

            if (!vehicle || !vehicle.id) {
                return;
            }

            const vehicleId =
                String(vehicle.id);

            activeVehicleIds.add(vehicleId);

            // Validate coordinates
            const lat =
                Number(vehicle.lat);

            const lng =
                Number(vehicle.lng);

            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
            ) {
                console.warn(
                    "Skipping vehicle with invalid coordinates:",
                    vehicle.objectName
                );
                return;
            }

            // Existing marker?
            let marker =
                trackStarMarkers.get(vehicleId);

            // CREATE NEW MARKER
            if (!marker) {

                marker =
                    createTrackStarMarker(vehicle);

                if (!marker) {
                    return;
                }

                marker.addTo(
                    trackStarVehicleLayer
                );

                trackStarMarkers.set(
                    vehicleId,
                    marker
                );

                console.log(
                    "NEW VEHICLE MARKER:",
                    vehicle.objectName
                );
            }

            // UPDATE EXISTING MARKER
            else {
                updateTrackStarMarker(
                    marker,
                    vehicle
                );
            }
        });

        // REMOVE VEHICLES NO LONGER RETURNED
        trackStarMarkers.forEach(
            function(marker, vehicleId) {

                if (
                    !activeVehicleIds.has(vehicleId)
                ) {

                    console.log(
                        "REMOVING VEHICLE:",
                        vehicleId
                    );

                    trackStarVehicleLayer.removeLayer(
                        marker
                    );

                    trackStarMarkers.delete(
                        vehicleId
                    );
                }
            }
        );

        console.log(
            "ACTIVE MAP MARKERS:",
            trackStarMarkers.size
        );

        console.log(
            "========================================"
        );
    }

    catch (error) {
        console.error(
            "TRACKSTAR UPDATE ERROR:",
            error
        );
    }

    finally {
        trackStarUpdating = false;
    }
}


// START TRACKSTAR AUTO UPDATE
function startTrackStarAutoUpdate() {

    // Prevent duplicate timers
    if (trackStarUpdateTimer) {

        console.warn(
            "TrackStar auto-update is already running."
        );

        return;
    }

    console.log(
        "========================================"
    );

    console.log(
        "STARTING TRACKSTAR AUTO UPDATE"
    );

    console.log(
        "INTERVAL:",
        TRACKSTAR_UPDATE_INTERVAL / 1000,
        "seconds"
    );

    console.log(
        "========================================"
    );

    // Initial update immediately
    updateAllTrackStarVehicles();

    // Continue updating automatically
    trackStarUpdateTimer =
        setInterval(
            updateAllTrackStarVehicles,
            TRACKSTAR_UPDATE_INTERVAL
        );
}

// STOP TRACKSTAR AUTO UPDATE
function stopTrackStarAutoUpdate() {

    if (!trackStarUpdateTimer) {

        console.log(
            "TrackStar auto-update is not running."
        );
        return;
    }

    clearInterval(
        trackStarUpdateTimer
    );

    trackStarUpdateTimer = null;

    console.log(
        "TRACKSTAR AUTO UPDATE STOPPED."
    );
}
*/