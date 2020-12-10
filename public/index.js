var http = new XMLHttpRequest();
var table = document.getElementById('table');
var genBtn = document.getElementById('gen-btn');
let data = [];
function createTableRow(data) {
    var row = document.createElement('tr');
    var td1 = document.createElement('td');
    td1.innerHTML = data.MapID;
    row.appendChild(td1);
    var td2 = document.createElement('td');
    td2.innerHTML = data.BuildingName;
    row.appendChild(td2);
    table.appendChild(row);

};
let resArr = [];
genBtn.onclick = function () {
    http.open('get', './firstquery', true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState === 4) {
            resArr = JSON.parse(this.responseText)
            for(let i=0;i<resArr.length;i++){
                createTableRow(resArr[i]);
            }
            data = resArr;
            let result = generatePercentage(data);
            
            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                title: {
                    text: "Land Master Data"
                },
                data: [{
                    type: "pie",
                    startAngle: 240,
                    yValueFormatString: "##0.00\"%\"",
                    indexLabel: "{label} {y}",
                    dataPoints: [
                        { y: result[0], label: "MapID Having BuildingName 'NULL'" },
                     
                        { y: result[1], label: "MapID Having BuildingName 'NO'" },
                      
                    ]
                }]
            });
            chart.render();
        
            $('#get-excel').css('display','block');
        }
    };
};

const generatePercentage = (data) => {
    let x=0;
    let y=0;
    for(let i=0;i<data.length;i++){
        if(data[i].BuildingName === ""){
            x = x+1;
        }else if(data[i].BuildingName === "no" || data[i].BuildingName ==="No"){
            y = y+1;
        }
    }
    let xInP = ((x/data.length)*100).toFixed(2);
    let yInP = ((y/data.length)*100).toFixed(2);
    return [xInP,yInP];

}




const exportToExcel = (xlsRows) => {

    var createXLSLFormatObj = [];

    /* XLS Head Columns */
    var xlsHeader = ["MapID", "BuildingName"];

    /* XLS Rows Data */
  /*   var xlsRows = [{
        "EmployeeID": "EMP001",
        "FullName": "Jolly"
    },
    {
        "EmployeeID": "EMP002",
        "FullName": "Macias"
    },
    {
        "EmployeeID": "EMP003",
        "FullName": "Lucian"
    },
    {
        "EmployeeID": "EMP004",
        "FullName": "Blaze"
    },
    {
        "EmployeeID": "EMP005",
        "FullName": "Blossom"
    },
    {
        "EmployeeID": "EMP006",
        "FullName": "Kerry"
    },
    {
        "EmployeeID": "EMP007",
        "FullName": "Adele"
    },
    {
        "EmployeeID": "EMP008",
        "FullName": "Freaky"
    },
    {
        "EmployeeID": "EMP009",
        "FullName": "Brooke"
    },
    {
        "EmployeeID": "EMP010",
        "FullName": "FreakyJolly.Com"
    }
    ]; */


    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows, function (index, value) {
        var innerRowData = [];
        $("tbody").append('<tr><td>' + value.MapID + '</td><td>' + value.BuildingName + '</td></tr>');
        $.each(value, function (ind, val) {

            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });


    /* File Name */
    var filename = "FreakyJSON_To_XLS.xlsx";

    /* Sheet Name */
    var ws_name = "FreakySheet";

    if (typeof console !== 'undefined') console.log(new Date());
    var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    /* Write workbook and Download */
    if (typeof console !== 'undefined') console.log(new Date());
    XLSX.writeFile(wb, filename);
    if (typeof console !== 'undefined') console.log(new Date());
};

$('#get-excel').click(function (e) { 
    e.preventDefault();
    exportToExcel(resArr);
});