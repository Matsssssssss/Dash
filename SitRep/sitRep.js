const API = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSNM4LdvZxOW09ZW8_7JQ3LBXqNt3qMrVU1Q1qDDoJN3kr2Ob2Kewe05hT4p_VY9vKb0lcc3ny8TdnjU6h7pS8dnhN5LHgyGL0HBGSxoHmrAO5llnHLwjbDjlcuBrGEmTctd5jH1-ER9puKx7qZBiVM4PomnWdMFW07ofo5QJ0D2LUjK0eDAAIFI82A0t_xHBZ9E7z55m85g9JfAb7MFPeOXPa18bYIk9QiGV2k78EzSWURV0UJYC0UbC-uxdi9gC-fGSQplTZG1pdx_zy5j13vyFcfog&lib=MNANA1_-13KamtEV0y-LG9OLM_uChZ4QT";

async function loadLatestPDF(){

    const response = await fetch(API);

    const data = await response.json();

    if(!data.found){

        document.getElementById("reportInfo")
            .textContent="No report uploaded.";

        return;

    }

    document.getElementById("pdfViewer").src =
        data.pdfUrl;

    document.getElementById("reportInfo")
        .textContent =
        `${data.pdfName} • ${new Date(data.lastUpdated).toLocaleString()}`;

}

loadLatestPDF();

setInterval(loadLatestPDF,30000);