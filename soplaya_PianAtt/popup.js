var loadData;
(function () {
    $(document).ready(function () {


        
  
		

        tableau.extensions.initializeDialogAsync().then(function (s) {
            console.log('extension initialized');
			//alert('inizializzato');
            payload = s;
            loadData();



     

          

        }, function (err) {
            // Something went wrong in initialization.
            console.log('Error while Initializing: ' + err.toString());
        });
    });
    /*  extension can define other functions here as needed */

    var payload;
    var _worksheetname = 'Piani Attività drill cliente';
    var worksheet;
    var worksheetData;
    const _GMVMeasureName = 'GMV';
    const _ForecastMeasureName = 'Forecast';

    var colRestaurantId_Name = "Restaurant Id (Sales Restaurants)";
    var colRestaurantName_Name = "Name (Sales Restaurants)" ;
    var colMese_Name = "MESE";
    var colNomeMisura_Name = "Measure Names";
    var colAnno_Name = "YEAR(Created)";
    var colSettimana_Name = "Settimana";
    var colValoreMisura_Name = "Measure Values";

    var colRestaurantId=-1;
    var colRestaurantName = -1;
    var colMese = -1;
    var colNomeMisura = -1;
    var colAnno = -1;
    var colSettimana = -1;
    var colValoreMisura = -1;
    
    

   loadData = function()
   {
       //alert('carico i dati');
	   const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
	   worksheet = worksheets.find(function (sheet) {
		return sheet.name === _worksheetname;
				});
					
					
       worksheet.getSummaryDataAsync({ ignoreSelection: true}).then(function (sumdata) {
           worksheetData = sumdata;
           buildTable(worksheetData);
			});
   };

    var buildTable = function (sumData) {
        $('#table').empty();
        //
        sumData.columns.forEach(function (c) {
            if (c.fieldName === colRestaurantId_Name)
                colRestaurantId = c.index;
            if (c.fieldName === colRestaurantName_Name)
                colRestaurantName = c.index;
            if (c.fieldName === colMese_Name)
                colMese = c.index;
            if (c.fieldName === colNomeMisura_Name)
                colNomeMisura = c.index;
            if (c.fieldName === colAnno_Name)
                colAnno = c.index;
            if (c.fieldName === colSettimana_Name)
                colSettimana = c.index;
            if (c.fieldName === colValoreMisura_Name)
                colValoreMisura = c.index;         
        });
       
        //metto i dati in una struttura ad-hoc che mi va comoda
        var markup = "";
        var lastRowId = "";
        var rows = {};
        var currRow = {};
        var anni = {};
        sumData.data.forEach(function (d) {
            if ((d[colNomeMisura].formattedValue === _GMVMeasureName) || (d[colNomeMisura].formattedValue === _ForecastMeasureName)) {
                var rowId = d[colRestaurantId].formattedValue + "#"
                    + d[colRestaurantName].formattedValue + "#"
                    + d[colNomeMisura].formattedValue + "#"
                    + d[colMese].formattedValue;


                if (rows[rowId])
                    currRow = rows[rowId];
                else {
                    currRow = {};
                    rows[rowId] = currRow;
                }

                //memorizziamo gli anni
                if (!(anni[d[colAnno].formattedValue]))
                    anni[d[colAnno].formattedValue] = d[colAnno].formattedValue;
                

                currRow[colRestaurantName] = d[colRestaurantName].formattedValue;
                currRow[colMese] = d[colMese].formattedValue;
                currRow[colNomeMisura] = d[colNomeMisura].formattedValue;
                currRow[colRestaurantId] = d[colRestaurantId].formattedValue;
                
                currRow[d[colAnno].formattedValue + '#' + d[colSettimana].formattedValue] = d[colValoreMisura].formattedValue;


                
        }
        });

        var anniArr = [];
        for (const anno of Object.keys(anni)) {
            anniArr.push(anno);
        }
        anniArr.sort();


        var anno1 = anniArr[1];
        var anno2 = anniArr[0];
        //add headers
        $('#table').append(`  
                                <tr>
                                <th colspan="3"> </th>
                                <th colspan="4">${anno1} </th>
                                 <th colspan="4">${anno2}</th>
                                </tr >
                                `
        );
        $('#table').append(`  
                                <tr>
                                <th>Cliente</th>
                                <th>Mese</th>
                                <th> </th>
                                <th> 1</th>
                                 <th> 2</th>
                                <th> 3</th>
                                 <th> 4</th>
                                <th> 1</th>
                                 <th> 2</th>
                                <th> 3</th>
                                 <th> 4</th>
                                </tr >
                                `
        );
        //costruimano la tabella
        for (const rowid of Object.keys(rows)) {
            var rowToRender = rows[rowid];
            markup = markup+"<tr>";
            markup = markup + "<td>" + rowToRender[colRestaurantName] + "</td>";
            markup = markup + "<td>" + rowToRender[colMese] + "</td>";
            markup = markup + "<td>" + rowToRender[colNomeMisura] + "</td>";

            if (rowToRender[colNomeMisura] === _ForecastMeasureName) {
                markup = markup + '<td><input type="number"  value="' + RenderStr(rowToRender[anno1 + '#1']) + '" name="' + rowid + "#" + anno1 + '-1'+'" /></td>';
                markup = markup + '<td><input type="number"  value="' + RenderStr(rowToRender[anno1 + '#2']) + '" name="' + rowid + "#" + anno1 + '-2' + '" /></td>';
                markup = markup + '<td><input type="number"  value="' + RenderStr(rowToRender[anno1 + '#3']) + '" name="' + rowid + "#" + anno1 + '-3' + '" /></td>';
                markup = markup + '<td><input type="number"  value="' + RenderStr(rowToRender[anno1 + '#4']) + '" name="' + rowid + "#" + anno1 + '-4' + '" /></td>';

                markup = markup + '<td><input type="number"  value="' + RenderStr(rowToRender[anno2 + '#1']) + '" name="' + rowid + "#" + anno2 + '-1' + '" /></td>';
                markup = markup + '<td><input type="number"  value="' + RenderStr(rowToRender[anno2 + '#2']) + '" name="' + rowid + "#" + anno2 + '-1' + '" /></td>';
                markup = markup + '<td><input type="number"  value="' + RenderStr(rowToRender[anno2 + '#3']) + '" name="' + rowid + "#" + anno2 + '-1' + '" /></td>';
                markup = markup + '<td><input type="number"  value="' + RenderStr(rowToRender[anno2 + '#4']) + '" name="' + rowid + "#" + anno2 + '-1' + '" /></td>';

            } else {


                markup = markup + "<td>" + RenderStr(rowToRender['2022#1']) + "</td>";
                markup = markup + "<td>" + RenderStr(rowToRender['2022#2']) + "</td>";
                markup = markup + "<td>" + RenderStr(rowToRender['2022#3']) + "</td>";
                markup = markup + "<td>" + RenderStr(rowToRender['2022#4']) + "</td>";
                markup = markup + "<td>" + RenderStr(rowToRender['2021#1']) + "</td>";
                markup = markup + "<td>" + RenderStr(rowToRender['2021#2']) + "</td>";
                markup = markup + "<td>" + RenderStr(rowToRender['2021#3']) + "</td>";
                markup = markup + "<td>" + RenderStr(rowToRender['2021#4']) + "</td>";
            }
            markup = markup + "</tr>"
        }
        $('#table').append(markup);

        $('input[type="number"]').on("change", focusoutHandler);
    } 

    function focusoutHandler(ev) {
    
    }

    function RenderStr(s) {
        var strOutPut = '';

        if ((s) || (typeof s !== 'undefined'))
        {
            var ss = s + "";
            if (ss !== "Null")
                strOutPut = ss;

        }

        return strOutPut;
    }

})();