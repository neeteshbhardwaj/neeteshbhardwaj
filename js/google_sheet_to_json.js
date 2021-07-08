const fileId = "1YI7lcbi58z0BIc8b2yoa4UWcjtXja16n-OY714_z3R4";
var resumeJson = {};
var defaultSettings = { totalSheets: 10000 };

function dataCallback(data) {
    var sheetNumber = data.feed.id.$t.split("/")[6];
    var sheetName = data.feed.title.$t;
    var array = [];
    data.feed.entry.map(entry => entry.gs$cell).forEach(cell => {
        if (cell.col == 1) array[cell.row] = [cell.$t];
        else array[cell.row].push(cell.$t);
    });
    var object = {};
    array.forEach(item => object[item[0]] = item[1]);
    resumeJson[sheetName] = object;
    var settings = resumeJson.settings || defaultSettings;
    if (sheetNumber < settings.totalSheets) loadData(++sheetNumber);
}

function loadData(sheetNumber) {
    var src = `https://spreadsheets.google.com/feeds/cells/${fileId}/${sheetNumber}/public/values?alt=resumeJson-in-script&callback=dataCallback`;
    var s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
    s.remove();
}

loadData(1);