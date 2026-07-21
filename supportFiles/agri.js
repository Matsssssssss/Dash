const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSx8Z42n66ZY0t6AxzOMDQxyLY6VApkVPeYE2eXCpoa-7UKO738VSmhRFD_YYPT6I1PA3zV5qCpllsJrg-_4N9Ah_rGrA9a87-9uySrXroraUTuynril1byD_jzEhJKZ3Guyq9CWr2EIxy7d_AgeZR-wtxMWsO3bMbYXIYW9NYT4-mSKQsAUdweKboPWr3X3KxKGM4teZrg5jlIi1kZqOnIme1kSeGP2rNFBfO1n1X3zLRoHZH0Z4k-WEUO-_kspDr752X2Fffp7IKTmcZ8xD2PB_FuBg&lib=MhdpfYgk_-ue8kdXH2HQjxeLM_uChZ4QT"

function loadData()
{
    fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        document.getElementById("rice_Farmers").textContent = data.riceFarmers;
        document.getElementById("rice_Area").textContent = data.riceArea;
        document.getElementById("corn_Farmers").textContent = data.cornFarmers;
        document.getElementById("corn_Area").textContent = data.cornArea;
        document.getElementById("hvcc_Farmers").textContent = data.hvccFarmers;
        document.getElementById("hvcc_Area").textContent = data.hvccArea;
        document.getElementById("livNPoultry_Farmers").textContent = data.livNPoulFarmers;
        document.getElementById("livNPoultry_Area").textContent = data.livNPoulArea;
        document.getElementById("fish_Farmers").textContent = data.fishFarmers;
        document.getElementById("fish_Area").textContent = data.fishArea;
        document.getElementById("total_Farmers").textContent = data.totalFarmers;
        document.getElementById("total_Area").textContent = data.totalArea;
        document.getElementById("livNPoultry_Farmers").textContent = data.livNPoulFarmers;
        document.getElementById("livNPoultry_Area").textContent = data.livNPoulArea;
        document.getElementById("fish_Farmers").textContent = data.fishFarmers;
        document.getElementById("fish_Area").textContent = data.fishArea;
        document.getElementById("total_Farmers").textContent = data.totalFarmers;
        document.getElementById("total_Area").textContent = data.totalArea;

        document.getElementById("loss_vol_rice").textContent = data.prodLossVol1;
        document.getElementById("loss_val_rice").textContent = data.prodLossVal1;
        document.getElementById("loss_vol_corn").textContent = data.prodLossVol2;
        document.getElementById("loss_val_corn").textContent = data.prodLossVal2;
        document.getElementById("loss_vol_hvcc").textContent = data.prodLossVol3;
        document.getElementById("loss_val_hvcc").textContent = data.prodLossVal3;
    })
    .catch(err => console.error(err));
}

loadData();

// Refresh every 30 seconds
setInterval(loadData, 3000);