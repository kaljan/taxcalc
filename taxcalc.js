

var costTable = {
    id:'cost_table',
    tax:{
        cur:'', // валюта пересчёта таможенной стоимости
        lim:NaN, // ограничение стоимости
        tax:NaN, // пошлина
        percent:NaN, // процент от суммы превышения 
    },
    header: ["Валюта", "Стоимость<br/>посылки", "Налог на<br/>посылку", "Итоговая<br/>стоимость"],
    data: [
    ],
};

var taxDataEur = {
    cur:'eur', // валюта пересчёта таможенной стоимости
    lim:22, // ограничение стоимости
    tax:5, // пошлина
    percent:15, // процент от суммы превышения
};

var curIdList = ['byn', 'usd', 'eur', 'rub', 'uah', 'pln', 'sek'];

/**
 * 
 * @param {*} to 
 * @param {*} from 
 */
function convertTaxData(to, from) {
    to.lim = NBRBExchange(to.cur, from.cur, from.lim);
    to.tax = NBRBExchange(to.cur, from.cur, from.tax);
    to.percent = from.percent;
}

/**
 * 
 * @param {*} value 
 * @param {*} tax 
 */
function calcTax(value, tax) {
    return ((value - tax.lim) * tax.percent) / 100 + tax.tax;
}

/**
 * 
 * @param {*} id 
 * @param {*} otax 
 * @param {*} itax 
 */
function initializeTax(id, otax, itax) {
    otax.cur = id;
    convertTaxData(otax, itax);
}

/**
 * 
 * @param {*} id 
 * @param {*} table 
 */
function addCostRow(id, table) {
    var row = new Object();
    row.id = id;
    row.value = NaN;
    row.duty = NaN;
    row.cost = NaN;
    table.data.push(row);
}

/**
 * 
 * @param {*} idList 
 * @param {*} table 
 */
function initializeTableData(idList, table) {
    idList.forEach(function(item){
        addCostRow(item, table);
    });
}

/**
 * Возвращает таблицу с данными о стоимости в разных валютах
 * 
 * @param {*} id абревиатура валюты
 * @param {*} value цена
 */
function updateCostTable(table, id, value) {
    table.data[0].value = NBRBExchangeToBYN(id, value);
    table.data[0].duty = calcTax(table.data[0].value, table.tax);
    table.data[0].cost = parseFloat(table.data[0].value) + parseFloat(table.data[0].duty);

    for (j = 1; j < table.data.length; j++) {
        table.data[j].value = NBRBExchangeFromBYN(table.data[j].id, table.data[0].value);
        table.data[j].duty = NBRBExchangeFromBYN(table.data[j].id, table.data[0].duty);
        table.data[j].cost = NBRBExchangeFromBYN(table.data[j].id, table.data[0].cost);
    }
}

/**
 * 
 * @param {*} idList 
 */
function initializeCost(idList, tax, table, value) {
    NBRBFetchCurrencies(idList);
    initializeTax(idList[0], table.tax, tax);
    initializeTableData(idList, table);
    updateCostTable(table, 'byn', value);
}

/**
 * 
 */
function initializeCalc() {
    initializeCost(curIdList, taxDataEur, costTable, 150);
    createTable(costTable);
}

/**
 * 
 * @param {*} id 
 */
function onValueChanged(id) {
    updateCostTable(costTable, id, getInputCellValue(id + '_input'));
    updateTable(costTable);
}
