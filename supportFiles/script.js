let SHEET_ID = '1RssDO1AS4Z0XcOcBxIT7TicqMgZKHNkroQORvhrxpnM'
let SHEET_TITLE = 'OPDRRMO_SitRep';
let SHEET_RANGE = 'A1:J28'

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' 
    + SHEET_ID + '/gviz/tq?sheet=' 
    + SHEET_TITLE + '&range=' 
    + SHEET_RANGE);

function loadData() {
    fetch(FULL_URL)
    .then(res => res.text())
    .then(rep => {
        let data = JSON.parse(rep.substr(47).slice(0,-2));

        //ALERT STATUS
    let white_Alert = document.getElementById('white_Alert');
    white_Alert.innerHTML = data.table.rows[2].c[1].v;
    let blue_Alert = document.getElementById('blue_Alert');
    blue_Alert.innerHTML = data.table.rows[3].c[1].v;
    let red_Alert = document.getElementById('red_Alert');
    red_Alert.innerHTML = data.table.rows[4].c[1].v;

    //RELATED INCIDENTS
    let flood_Incident = document.getElementById('flood_Incident');
    flood_Incident.innerHTML = data.table.rows[1].c[4].v;
    let rain_Induced_Landslide = document.getElementById('rain_Induced_Landslide');
    rain_Induced_Landslide.innerHTML = data.table.rows[2].c[4].v;
    let mun_AffectedbyIncident_Total = document.getElementById('mun_AffectedbyIncident_Total');
    mun_AffectedbyIncident_Total.innerHTML = data.table.rows[3].c[4].v;
    let brgys_AffectedbyIncident_Total = document.getElementById('brgys_AffectedbyIncident_Total');
    brgys_AffectedbyIncident_Total.innerHTML = data.table.rows[4].c[4].v;

    //EFFECTS TO POPULATION
    let casualty = document.getElementById('casualty');
    casualty.innerHTML = data.table.rows[0].c[7].v;
    let mun_Affected = document.getElementById('mun_Affected');
    mun_Affected.innerHTML = data.table.rows[1].c[7].v;
    let brgy_Affected = document.getElementById('brgy_Affected');
    brgy_Affected.innerHTML = data.table.rows[2].c[7].v;
    let family_Affected = document.getElementById('family_Affected');
    family_Affected.innerHTML = data.table.rows[3].c[7].v;
    let persons_Affected = document.getElementById('persons_Affected');
    persons_Affected.innerHTML = data.table.rows[4].c[7].v;
    let partially_Damaged_House = document.getElementById('partially_Damaged_House');
    partially_Damaged_House.innerHTML = data.table.rows[0].c[9].v;
    let totally_Damaged_House = document.getElementById('totally_Damaged_House');
    totally_Damaged_House.innerHTML = data.table.rows[1].c[9].v;
    let evacuation_Center = document.getElementById('evacuation_Center');
    evacuation_Center.innerHTML = data.table.rows[2].c[9].v;
    let persons_Inside_ECs = document.getElementById('persons_Inside_ECs');
    persons_Inside_ECs.innerHTML = data.table.rows[3].c[9].v;
    let persons_Outside_ECs = document.getElementById('persons_Outside_ECs');
    persons_Outside_ECs.innerHTML = data.table.rows[4].c[9].v;

    //Class Suspension
    let class_Suspend_Total = document.getElementById('class_Suspend_Total');
    class_Suspend_Total.innerHTML = data.table.rows[7].c[1].v;
    let primary_Total = document.getElementById('primary_Total');
    primary_Total.innerHTML = data.table.rows[8].c[1].v;
    let secondary_Total = document.getElementById('secondary_Total');
    secondary_Total.innerHTML = data.table.rows[9].c[1].v;
    let tertiary_Total = document.getElementById('tertiary_Total');
    tertiary_Total.innerHTML = data.table.rows[10].c[1].v;

    //Work Suspension
    let work_Suspend_Total = document.getElementById('work_Suspend_Total');
    work_Suspend_Total.innerHTML = data.table.rows[7].c[4].v;
    let work_Public = document.getElementById('work_Public');
    work_Public.innerHTML = data.table.rows[8].c[4].v;
    let work_Private = document.getElementById('work_Private');
    work_Private.innerHTML = data.table.rows[9].c[4].v;

    //POWER INTERRUPTION
    let powerInt_Affected_Total = document.getElementById('powerInt_Affected_Total');
    powerInt_Affected_Total.innerHTML = data.table.rows[7].c[7].v;
    let powerInt_Partial = document.getElementById('powerInt_Partial');
    powerInt_Partial.innerHTML = data.table.rows[8].c[7].v;
    let powerInt_Total = document.getElementById('powerInt_Total');
    powerInt_Total.innerHTML = data.table.rows[9].c[7].v;
    let powerInt_Restored = document.getElementById('powerInt_Restored');
    powerInt_Restored.innerHTML = data.table.rows[10].c[7].v;

    //NETWORK INTERRUPTION
    let networkOut_Total = document.getElementById('networkOut_Total');
    networkOut_Total.innerHTML = data.table.rows[7].c[9].v;
    let networkOut_Restored = document.getElementById('networkOut_Restored');
    networkOut_Restored.innerHTML = data.table.rows[9].c[9].v;

    //WATER INTERRUPTION
    let waterOut_Total = document.getElementById('waterOut_Total');
    waterOut_Total.innerHTML = data.table.rows[13].c[1].v;
    let waterOut_Restored = document.getElementById('waterOut_Restored');
    waterOut_Restored.innerHTML = data.table.rows[15].c[1].v;

    //DAMAGE TO INFRASTRUCTURE
    let infra_Road = document.getElementById('infra_Road');
    infra_Road.innerHTML = data.table.rows[13].c[4].v;
    let infra_Bridge = document.getElementById('infra_Bridge');
    infra_Bridge.innerHTML = data.table.rows[15].c[4].v;

    //SEAPORTS STATUS
    let sea_suspendOp = document.getElementById('sea_suspendOp');
    sea_suspendOp.innerHTML = data.table.rows[13].c[8].v;
    let sea_Passenger = document.getElementById('sea_Passenger');
    sea_Passenger.innerHTML = data.table.rows[14].c[8].v;
    let sea_Rolling_Cargo = document.getElementById('sea_Rolling_Cargo');
    sea_Rolling_Cargo.innerHTML = data.table.rows[15].c[8].v;
    let sea_Vessels = document.getElementById('sea_Vessels');
    sea_Vessels.innerHTML = data.table.rows[16].c[8].v;
    let sea_MTBC = document.getElementById('sea_MTBC');
    sea_MTBC.innerHTML = data.table.rows[17].c[8].v;

    //AIRPORT STATUS
    let flight_Affected = document.getElementById('flight_Affected');
    flight_Affected.innerHTML = data.table.rows[19].c[1].v;
    let flight_Passenger = document.getElementById('flight_Passenger');
    flight_Passenger.innerHTML = data.table.rows[20].c[1].v;

    //DAM MONITORING
    let dam_Level_Normal = document.getElementById('dam_Level_Normal');
    dam_Level_Normal.innerHTML = data.table.rows[19].c[4].v;
    let dam_Level_Warning = document.getElementById('dam_Level_Warning');
    dam_Level_Warning.innerHTML = data.table.rows[20].c[4].v;
    })
    .catch(err => console.error(err));
}

// Load when the page opens
loadData();

// Refresh every 30 seconds
setInterval(loadData, 5000);