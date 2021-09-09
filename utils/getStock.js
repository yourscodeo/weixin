const axios = require('axios');
const baseUrl = 'https://api.money.126.net/data/feed/';
const stockCode = [
        "603663",
        "603043",
        "600031",
        "600111",
      ]
function getStockCodes() {
	const stocks = stockCode;
	return stocks.map((code) => {
		if (isNaN(code[0])) {
			if (code.toLowerCase().indexOf('us_') > -1) {
				return code.toUpperCase();
			} else if (code.indexOf('hk') > -1) {
				return code;
			} else {
				return code.toLowerCase().replace('sz', '1').replace('sh', '0');
			}
		} else {
			return (code[0] === '6' ? '0' : '1') + code;
		}
	});
}

var stockCodes = getStockCodes();
// var stockCodes = [ '0603663', '0603043', '0600031', '0600111' ]

async function fetchAllData() {
	console.log('fetchAllData');
	axios
		.get(`${baseUrl}${stockCodes.join(',')}?callback=a`)
		.then(
			(rep) => {
                try {
                    const result = JSON.parse(rep.data.slice(2, -2));
					let data = [];
					Object.keys(result).map((item) => {
                        if (!result[item].code) {
                            result[item].code = item; //兼容港股美股
						}
						data.push(result[item]);
					});
                    // console.log(data);
                    //写一个display函数用于遍历展示这个这些数据
					// displayData(data);
				} catch (error) {}
			},
			(error) => {
				console.error(error);
			}
		)
		.catch((error) => {
			console.error(error);
		});
}
fetchAllData()
console.log(fetchAllData());
// module.exports = {
//     fetchAllData
// }