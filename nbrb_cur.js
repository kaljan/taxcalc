/**
 * Пересчёт курсов валют
 */

var exchangeData = {
    curAbbr:'byn', // Абревиатура национальной валюты (главной валюты банка)
    curTab:[], // Массив данных с курсами валют
};

/**
 * Получить JSON валюты по имени
 * 
 * {
 *   "Cur_ID":145, // ID валюты
 *   "Date":"2019-05-14T00:00:00", // дата
 *   "Cur_Abbreviation":"USD", // обревиатура
 *   "Cur_Scale":1, // номинал малюты
 *   "Cur_Name":"Доллар США", // название валюты
 *   "Cur_OfficialRate":2.0988 // официальный курс относительно белоруского рубля
 * }
 * 
 * {
 *   "Cur_ID":298,
 *   "Date":"2019-05-14T00:00:00",
 *   "Cur_Abbreviation":"RUB",
 *   "Cur_Scale":100,
 *   "Cur_Name":"Российских рублей",
 *   "Cur_OfficialRate":3.2080
 * }
 * http://www.nbrb.by/API/ExRates/Rates/UAH/?ParamMode=2
 * @param currency_name абревиатура валюты. пример 'usd'
 */

function NBRBFerchCurByAbbr(abbr) {
    var request = new XMLHttpRequest();
	var url = 'http://www.nbrb.by/API/ExRates/Rates/' + 
    abbr.toUpperCase() + '?ParamMode=2'
	request.open('GET', url, false);
	request.send();
	if (request.status == 200) {
		return JSON.parse(request.responseText);
	}
	return null;  
}

/**
 * 
 * @param {*} table 
 */
function printCurTable(table) {
	var str = JSON.stringify(table, "", 2);
    console.log(str);
}

/**
 * 
 * @param {*} curIDs 
 */
function NBRBFetchCurrencies(curIDs) {
    curIDs.forEach(function(item) {
        if (item == exchangeData.curAbbr) {
            return;
        }
        var cur = NBRBFerchCurByAbbr(item);
        if (cur != null) {
            exchangeData.curTab.push(cur);
        }
    });
}

/**
 * 
 * @param {*} cur 
 * @param {*} value 
 */
function NBRBConvertToBYN(cur, value) {
	return value * (cur.Cur_OfficialRate / cur.Cur_Scale);
}

/**
 * 
 * @param {*} cur 
 * @param {*} value 
 */
function NBRBConvertFromBYN(cur, value) {
	return value / (cur.Cur_OfficialRate / cur.Cur_Scale);
}

/**
 * 
 * @param {*} abbr 
 * @param {*} value 
 */
function NBRBExchangeToBYN(abbr, value) {
	if (abbr == exchangeData.curAbbr) {
		return value;
	}
	for (i = 0; i < exchangeData.curTab.length; i++) {
		if (exchangeData.curTab[i].Cur_Abbreviation == abbr.toUpperCase()) {
			var val = NBRBConvertToBYN(exchangeData.curTab[i], value);
			return val;
		}
	}
	return NaN;
}

/**
 * 
 * @param {*} abbr 
 * @param {*} value 
 */
function NBRBExchangeFromBYN(abbr, value) {
	if (abbr == exchangeData.curAbbr) {
		return value;
	}

	for (i = 0; i < exchangeData.curTab.length; i++) {
		if (exchangeData.curTab[i].Cur_Abbreviation == abbr.toUpperCase()) {
			return NBRBConvertFromBYN(exchangeData.curTab[i], value);
		}
	}
	return NaN;
}

/**
 * 
 * @param {*} toId 
 * @param {*} fromId 
 * @param {*} value 
 */
function NBRBExchange(toId, fromId, value) {
	return NBRBExchangeFromBYN(toId, NBRBExchangeToBYN(fromId, value));
}

function NBRBGetCurNameByAbbreviation(abbr) {
	for (var i = 0; i < exchangeData.curTab.length; i++) {
		if (exchangeData.curTab[i].Cur_Abbreviation == abbr.toUpperCase()) {
			return exchangeData.curTab[i].Cur_Name;
		}
	}
	if (abbr == exchangeData.curAbbr) {
		return "Белорусских рублей"
	}
	return undefined;
}
