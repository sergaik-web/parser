const xlsx = require('node-xlsx').default
const fs = require("fs");
const axios = require("axios");

const workSheetsFromFile = xlsx.parse(fs.readFileSync(`${__dirname}/data.xlsx`));
const data = workSheetsFromFile[0].data.slice(0, 835);

const getCountVacancy = async (text) => {
	const res = await axios({
		baseURL: 'https://api.hh.ru',
		url: '/vacancies',
		method: 'GET',
		params: {
			clusters: true,
			text: text,
			only_with_salary: true
		},
	}).then(res => res).catch(e => console.log(e))
	console.log(await res.data.items[3])
	return res.data
}

getCountVacancy(data[139][0])


// for (let i = 0; i < formatData.length; i++) {
// 	setTimeout(async () => {
// 		formatData[i][1] = await getCountVacancy(formatData[i][0])
// 		console.log(formatData[i], i)
// 		if (i === formatData.length - 1) {
// 			fs.writeFileSync(`${__dirname}/data1.xlsx`, xlsx.build([{name: "result parse", data: formatData}]))
// 		}
// 	}, i*1000)
// }

//
// fs.writeFileSync(`${__dirname}/data1.xlsx`, xlsx.build([{name: "result parse", data: formatData}]))
