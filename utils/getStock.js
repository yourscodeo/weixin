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

var html = ``;
function displayData(data){
html = ``
data.map(item =>{
    html += `【今日行情】\n${item.name}：今开：${item.open},昨收${item.yestclose}
    最高：${item.high} 最低：${item.low},涨跌：${item.updown},涨跌幅：${item.percent}，${item.arrow}\n`
})
// console.log(html);
}

async function fetchAllData() {
	console.log('fetchAllData');
	axios
		.get(`${baseUrl}${stockCodes.join(',')}?callback=a`)
		.then(
			(rep) => {
                var data = [];
                try {
                    const result = JSON.parse(rep.data.slice(2, -2));
					Object.keys(result).map((item) => {
                        if (!result[item].code) {
                            result[item].code = item; //兼容港股美股
						}
						data.push(result[item]);
					});
                    // console.log(data);
                    //写一个display函数用于遍历展示这个这些数据
					displayData(data);
				} catch (error) {}
			},
			(error) => {
				console.error(error);
			}
		)
		.catch((error) => {
			console.error(error);
		});
        return html
}
fetchAllData()
console.log(fetchAllData());
module.exports = {
    fetchAllData,
    html
}