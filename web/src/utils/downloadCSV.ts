import Papa from 'papaparse'

const downloadCSV = (data: string[][], name: string) => {

	const csv = data.reduce((agg, curr) => {
		return agg + curr.map(x => x.replace(/[^a-zA-Z0-9()/ ]/g, '')).join(",") + "\n"
	}, "")

	const hiddenElem = document.createElement("a")
	hiddenElem.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
	hiddenElem.target = '_blank'
	hiddenElem.download = `${name}.csv`
	hiddenElem.click();
}

export const downloadAsCSV = (data: any, headers: string[], filename = "csv-generated-by-mischool") => {

	let csv = Papa.unparse({ data: data, fields: headers})

	const hiddenElem = document.createElement("a")
	hiddenElem.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
	hiddenElem.target = '_blank'
	hiddenElem.download = `${filename}-generated-by-mischool.csv`
	hiddenElem.click()
}

export default downloadCSV