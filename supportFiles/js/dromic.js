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
        maxZoom:20,
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

//sidebar interactivity highlighting
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
fetch("data/ILOILO.geojson")
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
const TRACKSTAR_UPDATE_INTERVAL = 30000; // 30 seconds

// TRACKSTAR AUTO UPDATE CONFIGURATION
let trackStarUpdateTimer = null;

// TRACKSTAR VEHICLE DATA STORE
let trackStarVehicles = [];

// Store existing markers by vehicle ID
const trackStarMarkers = new Map();

// TRACKSTAR VEHICLE DATA REGISTRY
const trackStarVehicle = new Map();
//selected vehicle variable
let selectedTrackStarVehicleId = null;
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

// TRACKSTAR VEHICLE ICONS
// Custom Pickup icon
const TRACKSTAR_VEHICLE_ICONS = {

    Pickup: L.icon({
        iconUrl: "../Images/Assets/Vehicles/pickup.svg",
        iconSize: [30, 30],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Grader: L.icon({
        iconUrl: "../Images/Assets/Vehicles/grader.svg",
        iconSize: [40, 40],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Loader: L.icon({
        iconUrl: "../Images/Assets/Vehicles/loader.svg",
        iconSize: [40, 40],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Backhoe_Loader: L.icon({
        iconUrl: "../Images/Assets/Vehicles/backhoe_loader.svg",
        iconSize: [40, 40],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Compactor: L.icon({
        iconUrl: "../Images/Assets/Vehicles/compactor.svg",
        iconSize: [40, 40],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    SUV: L.icon({
        iconUrl: "../Images/Assets/Vehicles/suv.svg",
        iconSize: [30, 30],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Bus: L.icon({
        iconUrl: "../Images/Assets/Vehicles/bus.svg",
        iconSize: [40, 40],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Tanker_Truck: L.icon({
        iconUrl: "../Images/Assets/Vehicles/tanker_truck.svg",
        iconSize: [45, 60],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Truck: L.icon({
        iconUrl: "../Images/Assets/Vehicles/truck.svg",
        iconSize: [20, 20],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Dumper_Truck: L.icon({
        iconUrl: "../Images/Assets/Vehicles/dumper_truck.svg",
        iconSize: [20, 20],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Default: L.icon({
        iconUrl: "../Images/Assets/Vehicles/default.svg",
        iconSize: [30, 30],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    }),

    Head_Unit: L.icon({
        iconUrl: "../Images/Assets/Vehicles/default.svg",
        iconSize: [30, 30],
        iconAnchor: [18, 18],
        popupAnchor: [0, -21]
    })
};

// DEFAULT TRACKSTAR ICON
const TRACKSTAR_DEFAULT_ICON = L.icon({

    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// GET TRACKSTAR VEHICLE ICON
function getTrackStarVehicleIcon(vehicle) {

    const vehicleType =
        String(
            vehicle.vehicleType || ""
        ).trim();

    console.log(
        "SELECTING ICON:",
        vehicleType
    );

    switch (vehicleType) {

        // PICKUP
        case "Pickup":
            return TRACKSTAR_VEHICLE_ICONS.Pickup;
        
        // GRADER
        case "Grader":
            return TRACKSTAR_VEHICLE_ICONS.Grader;

        // LOADER
        case "Loader":
            return TRACKSTAR_VEHICLE_ICONS.Loader;

        // BACKHOE LOADER
        case "BACK HOE LOADER":
            return TRACKSTAR_VEHICLE_ICONS.Backhoe_Loader;

        // COMPACTOR
        case "Compactor":
            return TRACKSTAR_VEHICLE_ICONS.Compactor;

        // SUV
        case "SUV":
            return TRACKSTAR_VEHICLE_ICONS.SUV;

        // BUS
        case "Bus":
            return TRACKSTAR_VEHICLE_ICONS.Bus;

        // TANKER TRUCK
        case "TankerTruck":
            return TRACKSTAR_VEHICLE_ICONS.Tanker_Truck;

        // TRUCK
        case "Truck":
            return TRACKSTAR_VEHICLE_ICONS.Truck;

        // DUMPER TRUCK
        case "DUMPER":
            return TRACKSTAR_VEHICLE_ICONS.Dumper_Truck;

        // DEFAULT
        case "Default":
            return TRACKSTAR_VEHICLE_ICONS.Default;
        // HEAD UNIT
        case "HeadUnit":
            return TRACKSTAR_VEHICLE_ICONS.Head_Unit;

        // FALLBACK
        default:

            console.warn(
                "No custom icon for vehicle type:",
                vehicleType,
                "Using default TrackStar icon."
            );
            return TRACKSTAR_DEFAULT_ICON;
    }
}

//status class function
function getTrackStarStatusClass(vehicle) {

    const status = String(vehicle.status || "").trim().toLowerCase();

    switch (status) {
        case "inactive":
            return "status-inactive";

        case "running":
            return "status-running";

        case "stopped":
            return "status-stopped";

        case "idle":
            return "status-idle";

        default:
            return "status-inactive";
    }
}

// TRACKSTAR POPUP GENERATOR
function createTrackStarPopup(vehicle) {

    const vehicleName = vehicle.objectName || vehicle.name || "Unknown Vehicle";
    const vehicleType = vehicle.vehicleType || "Unknown Type";
    const status = vehicle.status || "Unknown";
    const branchName = vehicle.branchName || "Unknown Branch";
    const speed = Number(vehicle.speed || 0);
    const driver = vehicle.driver || "N/A";

    const gps =
        vehicle.gps ||
        "Unknown";

    const contact =
        vehicle.simCardNo ||
        "Unknown";

    const location =
        vehicle.location ||
        "Unknown";

    const lat =
        Number(vehicle.lat);

    const lng =
        Number(vehicle.lng);

    const coordinates =
        Number.isFinite(lat) &&
        Number.isFinite(lng)

        ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`

        : "Unavailable";


    return `

        <div class="trackstar-popup">

            <!-- VEHICLE HEADER -->
            <div class="trackstar-popup-header">
                <div class="trackstar-popup-title">
                    <strong>
                        ${vehicleName}
                    </strong>
                    <span>
                        ${vehicleType}
                    </span>
                </div>
            </div>

            <!-- STATUS -->
            <div class="trackstar-popup-status">
                <span class="${getTrackStarStatusClass(vehicle)}"></span>
                <strong>
                    ${status}
                </strong>
                <span class = "vehicle-branchName">
                    ${branchName}
                </span>
            </div>

            <!-- VEHICLE DATA -->
            <div class="trackstar-popup-data">
                <div class="trackstar-data-row">
                    <span>
                        Speed
                    </span>
                    <strong>
                        ${speed} km/h
                    </strong>
                </div>

                <div class="trackstar-data-row">
                    <span>
                        Driver
                    </span>
                    <strong>
                        ${driver}
                    </strong>
                </div>

                <div class="trackstar-data-row">
                    <span>
                        GPS
                    </span>
                    <strong>
                        ${gps}
                    </strong>
                </div>


                <div class="trackstar-data-row">
                    <span>
                        Contact
                    </span>
                    <strong>
                        ${contact}
                    </strong>
                </div>
            </div>

            <!-- LOCATION -->
            <div class="trackstar-popup-location">
                <div class="trackstar-section-title">
                    Location
                </div>
                <div>
                    ${location}
                </div>
            </div>
    `;
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

    const icon = getTrackStarVehicleIcon(vehicle);
    const marker = L.marker(
            [
                Number(vehicle.lat),
                Number(vehicle.lng)
            ],
            {
                icon: icon
            }
        );
    marker.bindPopup(createTrackStarPopup(vehicle)
    );

    if (
        selectedTrackStarVehicleId === String(vehicle.id)
    ) {
        
    marker.on("add", function() {highlightTrackStarMarker(marker);});
    }
    return marker;
}

// UPDATE EXISTING TRACKSTAR MARKER
function updateTrackStarMarker(marker, vehicle) {

    if (!marker || !vehicle) {
        return;
    }

    const newLat = Number(vehicle.lat);
    const newLng = Number(vehicle.lng);

    if (
        !Number.isFinite(newLat) ||
        !Number.isFinite(newLng)
    ) {
        console.warn(
            "Invalid coordinates for vehicle:",
            vehicle.objectName
        );

        return;
    }

    // Current marker position
    const currentPosition = marker.getLatLng();

    const oldLat = currentPosition.lat;
    const oldLng = currentPosition.lng;

    // Calculate movement distance
    const latDifference = newLat - oldLat;
    const lngDifference = newLng - oldLng;

    // If the vehicle hasn't moved,
    // don't perform an animation.
    if (
        Math.abs(latDifference) < 0.000001 &&
        Math.abs(lngDifference) < 0.000001
    ) {

        marker.setPopupContent(
            createTrackStarPopup(vehicle)
        );

        return;
    }

    // Animation duration in milliseconds
    const duration = 1000;
    const startTime = performance.now();

    function animateMarker(currentTime) {

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing
        const easedProgress =
            progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(
                    -2 * progress + 2,
                    2
                ) / 2;

        const animatedLat = oldLat +
            (newLat - oldLat) * easedProgress;
        const animatedLng = oldLng +
            (newLng - oldLng) * easedProgress;

        marker.setLatLng([animatedLat, animatedLng]);

        if (progress < 1) {

            requestAnimationFrame(
                animateMarker
            );

        } else {

            // Make absolutely sure
            // the marker finishes exactly
            // at the API coordinates.
            marker.setLatLng([
                newLat,
                newLng
            ]);
        }
    }

    requestAnimationFrame(
        animateMarker
    );

    // Update popup information
    marker.setPopupContent(
        createTrackStarPopup(vehicle)
    );
}

//sidebar List
function renderVehicleList() {

    const vehicleList = document.getElementById("vehicleList");
    const vehicleCount = document.getElementById("vehicleCount");

    if (!vehicleList) {
        return;
    }

    const vehicles = getFilteredTrackStarVehicles();
    vehicleList.innerHTML = "";

    if (vehicleCount) {
        vehicleCount.textContent = vehicles.length;
    }

    if (vehicles.length === 0) {
        vehicleList.innerHTML = `
            <div class="vehicle-empty">
                No vehicles found.
            </div>
        `;
        return;
    }

    vehicles.forEach(function(vehicle) {

        const vehicleId = String(vehicle.id);
        const vehicleItem = document.createElement("div");
        vehicleItem.className = "vehicle-list-item";
        vehicleItem.dataset.vehicleId = vehicleId;

        // SELECTED STATE
        if (
            selectedTrackStarVehicleId === vehicleId
        ) {
            vehicleItem.classList.add("selected");
        }

        // VEHICLE CLICK
        vehicleItem.addEventListener("click", function()
            {
                console.log("SIDEBAR VEHICLE CLICK:", vehicleId);
                selectTrackStarVehicle(vehicleId);
            }
        );

        // VEHICLE CONTENT
        vehicleItem.innerHTML = `
            <div class="vehicle-list-status">
                <span
                    class="${getTrackStarStatusClass(vehicle)}"
                ></span>
            </div>

            <div class="vehicle-list-info">

                <strong>
                    ${vehicle.objectName || "Unknown Vehicle"}
                </strong>

                <span>
                    ${vehicle.vehicleType || "Unknown Type"}
                </span>

                <small>
                    ${vehicle.branchName || "Unknown Branch"}
                </small>
            </div>
        `;
        vehicleList.appendChild(vehicleItem);
    });

    // Make map visibility match sidebar
    syncFilteredVehiclesWithMap();
}


// SELECT VEHICLE FROM SIDEBAR
function selectTrackStarVehicle(vehicleId) {

    vehicleId = String(vehicleId);

    console.log("========================================");
    console.log("SELECTING TRACKSTAR VEHICLE");
    console.log("VEHICLE ID:", vehicleId);

    // SAME VEHICLE CLICKED AGAIN → UNSELECT
    if (selectedTrackStarVehicleId === vehicleId) {

        console.log("SAME VEHICLE SELECTED AGAIN → UNSELECTING");
        const marker = trackStarMarkers.get(vehicleId);

        // Close popup
        if (marker) {
            marker.closePopup();
        }

        // Remove sidebar selection
        document.querySelectorAll(".vehicle-list-item").forEach(function(item) {item.classList.remove("selected");});

        // Clear selected vehicle
        selectedTrackStarVehicleId = null;
        console.log("VEHICLE UNSELECTED:", vehicleId);
        console.log("========================================");
        return;
    }
    

    // GET VEHICLE DATA
    const vehicle = trackStarVehicle.get(vehicleId);

    if (!vehicle) {
        console.warn("Vehicle data not found:", vehicleId);
        console.log("Available vehicle IDs:", Array.from(trackStarVehicle.keys()));
        return;
    }
    console.log("VEHICLE FOUND:", vehicle);

    // GET MARKER
    const marker = trackStarMarkers.get(vehicleId);

    if (!marker) {
        console.warn("Vehicle marker not found:", vehicleId);
        console.log("Available marker IDs:", Array.from(trackStarMarkers.keys()));
        return;
    }

    console.log("MARKER FOUND:", marker);

    // REMOVE PREVIOUS SELECTION
    document.querySelectorAll(".vehicle-list-item").forEach(function(item) {
            item.classList.remove("selected");
        });

    // SAVE NEW SELECTION
    selectedTrackStarVehicleId = vehicleId;

    // HIGHLIGHT SIDEBAR ITEM
    const selectedItem =document.querySelector(`.vehicle-list-item[data-vehicle-id="${vehicleId}"]`);

    if (selectedItem) {
        selectedItem.classList.add("selected");
        selectedItem.scrollIntoView({behavior: "smooth", block: "nearest"});
    }

    // OPTIONAL: CENTER MAP
    map.setView(
        marker.getLatLng(),
        14,
        {
            animate: true
        }
    );

    // OPEN POPUP
    marker.openPopup();

    console.log("VEHICLE SELECTED SUCCESSFULLY:", vehicle.objectName);
    console.log("========================================");
}

function getVehicleStatusClass(status) {

    if (!status) {return "inactive";}
    switch (status.toLowerCase()) 
    {
        case "running":
            return "running";

        case "stopped":
            return "stopped";

        case "idle":
            return "idle";

        case "inactive":
            return "inactive";

        default:
            return "inactive";
    }
}

function populateVehicleFilters() {

    const typeFilter = document.getElementById("vehicleTypeFilter");
    const branchFilter = document.getElementById("branchFilter");
    const statusFilter = document.getElementById("statusFilter");

    if (
        !typeFilter ||
        !branchFilter ||
        !statusFilter
    ) {
        return;
    }

    // Preserve current selections
    const currentType = typeFilter.value;
    const currentBranch = branchFilter.value;
    const currentStatus = statusFilter.value;
    const vehicleTypes = new Set();
    const branches = new Set();
    const statuses = new Set();

    trackStarVehicles.forEach(
        function(vehicle) {
            if (vehicle.vehicleType) {
                vehicleTypes.add(
                    vehicle.vehicleType
                );
            }

            if (vehicle.branchName) {
                branches.add(
                    vehicle.branchName
                );
            }

            if (vehicle.status) {
                statuses.add(
                    vehicle.status
                );
            }

        }
    );

    // Reset options
    typeFilter.innerHTML = `
        <option value="all">
            ALL Vehicle Types
        </option>
    `;

    branchFilter.innerHTML = `
        <option value="all">
            All Branches
        </option>
    `;

    statusFilter.innerHTML = `
        <option value="all">
            All Status
        </option>
    `;

    // Vehicle types
    Array.from(vehicleTypes)
        .sort()
        .forEach(function(type) {

            typeFilter.innerHTML += `
                <option value="${type}">
                    ${type}
                </option>
            `;
        });

    // Branches
    Array.from(branches)
        .sort()
        .forEach(function(branch) {
            branchFilter.innerHTML += `
                <option value="${branch}">
                    ${branch}
                </option>
            `;
        });

    // Status
    Array.from(statuses)
        .sort()
        .forEach(function(status) {

            statusFilter.innerHTML += `
                <option value="${status}">
                    ${status}
                </option>
            `;
        });

    // Restore selection if still available
    typeFilter.value = currentType;
    branchFilter.value = currentBranch;
    statusFilter.value = currentStatus;
}

function getFilteredTrackStarVehicles() {

    const searchInput = document.getElementById("vehicleSearch");
    const typeFilter = document.getElementById("vehicleTypeFilter");
    const branchFilter = document.getElementById("branchFilter");
    const statusFilter = document.getElementById("statusFilter");
    const search = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;
    const selectedBranch = branchFilter.value;
    const selectedStatus = statusFilter.value;

    return Array.from(
        trackStarVehicles.values()
    ).filter(function(vehicle) {

        const vehicleName = (vehicle.objectName || vehicle.name || "").toLowerCase();
        const vehicleType = vehicle.vehicleType || "";
        const branch = vehicle.branchName || "";
        const status = vehicle.status || "";

        // Search
        if (
            search &&
            !vehicleName.includes(search)
        ) {
            return false;
        }

        // Vehicle type
        if (
            selectedType !== "all" &&
            vehicleType !== selectedType
        ) {
            return false;
        }

        // Branch
        if (
            selectedBranch !== "all" &&
            branch !== selectedBranch
        ) {
            return false;
        }

        // Status
        if (
            selectedStatus !== "all" && 
            status !== selectedStatus
        ) {
            return false;
        }

        return true;
    });
}

// SYNC MAP MARKERS WITH SIDEBAR FILTER
function syncFilteredVehiclesWithMap() {

    console.log("SYNCING SIDEBAR FILTER WITH MAP");

    // Get vehicles currently visible in sidebar
    const filteredVehicles = getFilteredTrackStarVehicles();

    // Create a Set of their IDs for fast lookup
    const filteredVehicleIds = new Set(
        filteredVehicles.map(vehicle => String(vehicle.id))
    );

    console.log(
        "FILTERED VEHICLE IDS:",
        Array.from(filteredVehicleIds)
    );

    // Check every vehicle marker
    trackStarMarkers.forEach(function(marker, vehicleId) {

        const id = String(vehicleId);

        if (filteredVehicleIds.has(id)) {

            // Vehicle is in filtered sidebar → SHOW
            if (!trackStarVehicleLayer.hasLayer(marker)) {

                trackStarVehicleLayer.addLayer(marker);

                console.log(
                    "SHOWING VEHICLE:",
                    id
                );
            }

        } else {

            // Vehicle is NOT in filtered sidebar → HIDE
            if (trackStarVehicleLayer.hasLayer(marker)) {

                trackStarVehicleLayer.removeLayer(marker);

                console.log(
                    "HIDING VEHICLE:",
                    id
                );
            }
        }
    });

    console.log("VISIBLE MAP MARKERS:", trackStarVehicleLayer.getLayers().length);
}

//Connect the Search and Filters
function initializeVehicleSidebar() {

    const searchInput = document.getElementById("vehicleSearch");
    const typeFilter = document.getElementById("vehicleTypeFilter");
    const branchFilter = document.getElementById("branchFilter");
    const statusFilter = document.getElementById("statusFilter");
    searchInput.addEventListener("input", renderVehicleList);
    typeFilter.addEventListener("change", renderVehicleList);
    branchFilter.addEventListener("change", renderVehicleList);
    statusFilter.addEventListener("change", renderVehicleList);
    console.log("Vehicle sidebar initialized.");
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
        const vehicles = await fetchTrackStarVehicles();
        trackStarVehicles = vehicles;

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

            const vehicleId = String(vehicle.id);

            // Store latest vehicle data
            trackStarVehicle.set(vehicleId, vehicle);
            activeVehicleIds.add(vehicleId);

            // Validate coordinates
            const lat = Number(vehicle.lat);

            const lng = Number(vehicle.lng);

            if (!Number.isFinite(lat) ||!Number.isFinite(lng)) {
                console.warn(
                    "Skipping vehicle with invalid coordinates:",
                    vehicle.objectName
                );
                return;
            }

            // Existing marker?
            let marker = trackStarMarkers.get(vehicleId);

            // CREATE NEW MARKER
            if (!marker) {

                marker = createTrackStarMarker(vehicle);

                if (!marker) {
                    return;
                }
                trackStarMarkers.set(vehicleId, marker);
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

        // Update sidebar
        populateVehicleFilters();
        renderVehicleList();

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

// TRACKSTAR START / SHOW BUTTON
async function startOrShowTrackStarVehicles() {

    const button =document.getElementById("showAllVehicles");

    if (!button) {
        console.warn("Start/Show button not found.");
        return;
    }

    // START MODE
    if (button.dataset.mode === "start") {

        console.log("STARTING TRACKSTAR FROM SIDEBAR BUTTON");

        // Change button temporarily
        button.textContent = "Loading...";
        button.disabled = true;

        // Start TrackStar auto update
        startTrackStarAutoUpdate();

        // Give the initial API update a chance to complete
        await new Promise(function(resolve) {
            setTimeout(resolve, 500);
        });

        // Change button state
        button.dataset.mode = "show";
        button.textContent = "Show";
        button.disabled = false;

        console.log("TRACKSTAR STARTED");
        return;
    }

    // SHOW MODE
    if (button.dataset.mode === "show") {

        console.log("SHOWING FILTERED TRACKSTAR VEHICLES");

        // Show only vehicles currently
        // present in the filtered sidebar
        syncFilteredVehiclesWithMap();

        console.log(
            "FILTERED VEHICLES SHOWN:",
            getFilteredTrackStarVehicles().length
        );
    }
}

// TRACKSTAR VEHICLE VISIBILITY CONTROLS
// SHOW ALL VEHICLES
function showAllTrackStarVehicles() {

    console.log(
        "SHOWING ALL TRACKSTAR VEHICLES"
    );

    trackStarMarkers.forEach(function(marker) {

        if (!trackStarVehicleLayer.hasLayer(marker)) {
            trackStarVehicleLayer.addLayer(marker);
        }
    });

    console.log(
        "VISIBLE VEHICLES:",
        trackStarMarkers.size
    );
}

// HIDE ALL VEHICLES
function hideAllTrackStarVehicles() {

    console.log(
        "HIDING ALL TRACKSTAR VEHICLES"
    );

    trackStarMarkers.forEach(function(marker) {

        if (trackStarVehicleLayer.hasLayer(marker)) {
            trackStarVehicleLayer.removeLayer(marker);
        }
    });

    console.log(
        "VISIBLE VEHICLES:",
        trackStarVehicleLayer.getLayers().length
    );
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

//vehicle search
function filterTrackStarVehicles() {

    const search =
        document
            .getElementById("vehicleSearch")
            .value
            .trim()
            .toLowerCase();

    const results =
        trackStarVehicles.filter(function(vehicle) {

            return (
                vehicle.objectName
                    ?.toLowerCase()
                    .includes(search) ||

                vehicle.name
                    ?.toLowerCase()
                    .includes(search) ||

                vehicle.imei
                    ?.toLowerCase()
                    .includes(search)
            );
        });
    renderFilteredVehicleList(results);
}

document.getElementById("vehicleSearch").addEventListener("input", filterTrackStarVehicles);

//vehicleType filter
function populateVehicleTypeFilter() {

    const select =
        document.getElementById(
            "vehicleTypeFilter"
        );

    const types =
        [
            ...new Set(
                trackStarVehicles
                    .map(vehicle =>
                        vehicle.vehicleType
                    )
                    .filter(Boolean)
            )
        ]
        .sort();

    select.innerHTML = `
        <option value="all">
            All Vehicle Types
        </option>
    `;

    types.forEach(function(type) {

        const option =
            document.createElement("option");

        option.value = type;
        option.textContent = type;

        select.appendChild(option);
    });
}

//branch filter
function populateBranchFilter() {

    const select =
        document.getElementById(
            "branchFilter"
        );

    const branches =
        [
            ...new Set(
                trackStarVehicles
                    .map(vehicle =>
                        vehicle.branchName
                    )
                    .filter(Boolean)
            )
        ]
        .sort();

    select.innerHTML = `
        <option value="all">
            All Branches
        </option>
    `;

    branches.forEach(function(branch) {

        const option =
            document.createElement("option");

        option.value = branch;
        option.textContent = branch;
        select.appendChild(option);
    });
}

//status filter
function populateStatusFilter() {

    const select =
        document.getElementById(
            "statusFilter"
        );

    const statuses =
        [
            ...new Set(
                trackStarVehicles
                    .map(vehicle =>
                        vehicle.status
                    )
                    .filter(Boolean)
            )
        ]
        .sort();

    select.innerHTML = `
        <option value="all">
            All Statuses
        </option>
    `;

    statuses.forEach(function(status) {

        const option =
            document.createElement("option");

        option.value = status;
        option.textContent = status;
        select.appendChild(option);
    });
}

//combine everything in the sidebar
function getFilteredTrackStarVehicles() {

    const search =document.getElementById("vehicleSearch").value.trim().toLowerCase();
    const type = document.getElementById("vehicleTypeFilter").value;
    const branch = document.getElementById("branchFilter").value;
    const status = document.getElementById("statusFilter").value;

    return trackStarVehicles.filter(
        function(vehicle) {

            const matchesSearch =
                !search ||
                vehicle.objectName
                    ?.toLowerCase()
                    .includes(search) ||
                vehicle.imei
                    ?.toLowerCase()
                    .includes(search);

            const matchesType =
                type === "all" ||
                vehicle.vehicleType === type;

            const matchesBranch =
                branch === "all" ||
                vehicle.branchName === branch;

            const matchesStatus =
                status === "all" ||
                vehicle.status === status;

            return (
                matchesSearch &&
                matchesType &&
                matchesBranch &&
                matchesStatus
            );
        }
    );
}

document.addEventListener("DOMContentLoaded", function() {

    // Initialize vehicle sidebar
    initializeVehicleSidebar();

    // Show All button
    const showAllButton = document.getElementById("showAllVehicles");

    if (showAllButton) {
        showAllButton.dataset.mode = "start";
        showAllButton.textContent = "Start";
        showAllButton.addEventListener("click", startOrShowTrackStarVehicles);
    }

    // Hide All button
    const hideAllButton = document.getElementById("hideAllVehicles");

    if (hideAllButton) {
        hideAllButton.addEventListener(
            "click",
            hideAllTrackStarVehicles
        );
    }
});