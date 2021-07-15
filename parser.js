const xlsx = require('node-xlsx').default
const fs = require("fs");
const axios = require("axios");
const cheerio = require('cheerio')

const workSheetsFromFile = xlsx.parse(fs.readFileSync(`${__dirname}/data.xlsx`));
const data = workSheetsFromFile[0].data.slice(0, 835);

const getPage = async (text) => {
	const res = await axios({
		baseURL: 'https://hh.ru/search',
		url: '/resume',
		params: {
			text: text,
			area: 113,
			isDefaultArea: true,
			exp_period: 'all_time',
			logic: 'normal',
			pos: 'full_text',
			fromSearchLine: false,
			st: 'resumeSearch'
		},
		headers: {
			'Accept': 'text/html',
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		}
	}).then(res => res).catch(e => console.log(e));

	const load = cheerio.load(res.data, {decodeEntities: false})

	return +load('span .bloko-text-emphasis').html().split(' ')[1].replace('&nbsp;', '')
}

// getPage(data[16][0])

for (let i = 0; i < data.length; i++) {
	setTimeout(async () => {
		data[i][3] = await getPage(data[i][0])
		console.log(data[i], i)
		if (i === data.length - 1) {
			fs.writeFileSync(`${__dirname}/data1.xlsx`, xlsx.build([{name: "result parse", data: data}]))
		}
	}, i*1000)
}

//
// fs.writeFileSync(`${__dirname}/data1.xlsx`, xlsx.build([{name: "result parse", data: formatData}]))
