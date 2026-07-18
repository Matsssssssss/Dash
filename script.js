let SHEET_ID = '1RssDO1AS4Z0XcOcBxIT7TicqMgZKHNkroQORvhrxpnM'
let SHEET_TITLE = 'OPDRRMO_SitRep';
let SHEET_RANGE = 'A1:J28'

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' 
    + SHEET_ID + '/gviz/tq?sheet=' 
    + SHEET_TITLE + '&range=' 
    + SHEET_RANGE);

fetch(FULL_URL)
.then(res => res.text())
.then(rep => {
    let data = JSON.parse(rep.substr(47).slice(0,-2));
    
    let red_alert = document.getElementById('red_alert');
    red_alert.innerHTML = data.table.rows[0].c[1].v;
    let blue_alert = document.getElementById('blue_alert');
    blue_alert.innerHTML = data.table.rows[1].c[1].v;
    let white_alert = document.getElementById('white_alert');
    white_alert.innerHTML = data.table.rows[2].c[1].v;
})