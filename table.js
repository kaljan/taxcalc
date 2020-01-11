
/**
 * Создать ячейку ввода значения
 * 
 * @param {*} id 
 * @param {*} value 
 */
function createInputCell(id, value) {
    var input_inner_html = "<input " + 
        "type=\"text\" "+
        "class=\"inputStyle\""+
        "id=\"" + id + "_input\"" +
        "size=\"10\" " +
        "align=\"center\" " + "border=\"0\" " +
        "value=\"" + formatFloat(value) + "\" " +
        "onchange=\"onValueChanged(\'"  + id+ "\')\">" +
    "</input>";
    var td_value = document.createElement('td');
    td_value.className = "inputTdStyle";
	td_value.innerHTML = input_inner_html;
	return td_value;
	
}

function formatFloat(value) {
    return parseFloat(value).toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}

/** 
 *  Установить значение ячейки
 */
function setInputCellValue(id, value) {
	var in_cell = document.getElementById(id);
	in_cell.value = formatFloat(value);
}

/**
 * Получить значение ячейки ввода
 * 
 * @param {*} id 
 */
function getInputCellValue(id) {
    var in_cell = document.getElementById(id);
    return in_cell.value;
}

/**
 * Создать текстовую ячейку
 * 
 * @param {*} id 
 * @param {*} text 
 */
function createTextCell(id, text) {
	var cell = document.createElement('td');
    cell.id = id;
    cell.align = 'center';
	cell.innerHTML = text;
	return cell; 
}

/**
 * Установить значение в текстовой ячейке таблицы
 * 
 * @param {*} id 
 * @param {*} value 
 */
function setTextCellValue(id, value) {
	var cell = document.getElementById(id);
	cell.innerHTML = formatFloat(value);
}

/**
 * Создать заголовок таблицы
 */
function createHeaderRow(context, table) {
	// var curr_table = document.getElementById(table_id);
	var row = document.createElement('tr');
	for (i = 0; i < context.length; i++) {
        var th = document.createElement('th');
		th.innerHTML = context[i];
		row.appendChild(th);
	}
	table.appendChild(row);
}

/**
 * 
 * @param {*} context элемент таблицы table_data
 */
function createRow(context, table) {
    var row = document.createElement('tr');
    var curName = NBRBGetCurNameByAbbreviation(context.id);
    if (curName == undefined) {
        row.appendChild(createTextCell(context.id + "_name", context.id.toUpperCase()));
    } else {
        row.appendChild(createTextCell(context.id + "_name", curName + ", "+ context.id.toUpperCase()));
    }
    row.appendChild(createInputCell(context.id, context.value));
    row.appendChild(createTextCell(context.id + '_duty', formatFloat(context.duty)));
    row.appendChild(createTextCell(context.id + '_cost', formatFloat(context.cost)));
    table.appendChild(row);
}

/**
 * 
 * @param {*} table 
 */
function createTable(table) {
    var tbl = document.getElementById(table.id);
    createHeaderRow(table.header, tbl);
    table.data.forEach(function(item) {
        createRow(item, tbl);
    });
}

/**
 * Обновить значения таблицы
 * 
 * @param {*} id 
 * @param {*} table 
 */
function updateTable(table) {
    table.data.forEach(function(context) {
        setInputCellValue(context.id + '_input', context.value);
        setTextCellValue(context.id + '_duty', context.duty);
        setTextCellValue(context.id + '_cost', context.cost);
    });
}
