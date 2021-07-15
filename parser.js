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
			only_with_salary: true,
			per_page: 100,
			currency: 'RUR'
		},
	}).then(res => res).catch(e => console.log(e))
	const countVac = res.data.found
	if (!countVac) {
		return 0
	}

	const salaryArr = res.data.items.map((item) => {
		if (!item.salary.to) {
			return [item.salary.from, item.salary.currency]
		} else {
			return [(item.salary.from + item.salary.to) / 2, item.salary.currency]
		}
	})

	const result = salaryArr.reduce((sum, cur) => {
		switch (cur[1]) {
			case 'RUR':
				return cur[0] + sum;
			case 'USD':
				return (cur[0]*74) + sum;
			case 'BYR':
				return (cur[0]*33) + sum;
			case 'KZT':
				return (cur[0]/6) + sum;
			case 'EUR':
				return (cur[0]*87) + sum;
			default:
				return cur[0] + sum;
		}
	}, 0) / salaryArr.length

	return Math.trunc(result)
}



for (let i = 0; i < data.length; i++) {
	setTimeout(async () => {
		if (data[i][1]) {
			data[i][2] = await getCountVacancy(data[i][0])
		} else {
			data[i][2] = 0
		}

		console.log(data[i], i)

		if (i === data.length - 1) {
			fs.writeFileSync(`${__dirname}/data1.xlsx`, xlsx.build([{name: "result parse", data: data}]))
		}
	}, i*1000)
}

//
// fs.writeFileSync(`${__dirname}/data1.xlsx`, xlsx.build([{name: "result parse", data: formatData}]))
