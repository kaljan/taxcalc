/**
 * @brief Пересчёт курсов валют
 * 
 * В этом файле собраны функции для перевода в разные валюты.
 * 
 * В коде использовано API от НБРБ http://www.nbrb.by/APIHelp/ExRates
 */

var exchangeData = {
    curAbbr:'byn', // Абревиатура национальной валюты (главной валюты банка)
    curTab:[], // Массив данных с курсами валют
};

/**
 * Получить объект валюты по аббривеатуре
 * 
 * Отправляет запрос на сервер НБРБ:
 * 
 * http://www.nbrb.by/API/ExRates/Rates/USD?ParamMode=2
 * 
 * Получает JSON (пример ниже). Парсит его и превращает в объект.
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
 * 
 * 
 * 
 * @param abbr абревиатура валюты. пример 'usd'
 * @returns в случае успеха возвращает объект валюты, иначе null
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
 * Вывести в лог объект
 * 
 * @param {*} table любой объект
 */
function printCurTable(table) {
	var str = JSON.stringify(table, "", 2);
    console.log(str);
}

/**
 * Получает список объектов валюты из списка аббревиатур.
 * 
 * @param {*} curIDs список абривеатур валют, которые 
 * нужно получить с сервера. пример 'usd'
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
 * Конвертирует валлюту cur в белорусские рубли
 * @param {*} cur 	валюта из которой нужно конвертировать
 * @param {*} value значение в ин. валюте
 * @returns значение в белорусских рублях
 */
function NBRBConvertToBYN(cur, value) {
	return value * (cur.Cur_OfficialRate / cur.Cur_Scale);
}

/**
 * Конвертирует белорусские рубли в валюту cur 
 * @param {*} cur 	валюта, в которую нужно конвертировать. 
 * @param {*} value значение в белоруских рублях
 * @returns значение в валюте
 */
function NBRBConvertFromBYN(cur, value) {
	return value / (cur.Cur_OfficialRate / cur.Cur_Scale);
}

/**
 * Конвертирует валюту в белорусские рубли по абривеатуре
 * 
 * @param {*} abbr абревиатура валюты
 * @param {*} value значение
 * @returns значение в белорусских рублях
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
 * Конвертирует в иностранную валюту по аббревиатуре валюты
 * 
 * @param {*} abbr аббревиатура валюты
 * @param {*} value значение в белорусских рублях
 * @returns значение в валюте
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
 * Конвертирует из валюты в валюту по аббревиатурам
 * 
 * @param {*} toId аббревиатура валюты, в которую будет конверсия
 * @param {*} fromId аббревиатура валюты из которой будет конверсия
 * @param {*} value значение валюты fromId
 * @returns значение валюты toId
 */
function NBRBExchange(toId, fromId, value) {
	return NBRBExchangeFromBYN(toId, NBRBExchangeToBYN(fromId, value));
}

/**
 * Получить полное название валюты по аббривеатуре
 * 
 * @param {*} abbr аббревиатура валюты
 * @returns название валюты
 */
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
