const { TableView } = require('./table-view');

const add = function(currentCol, numRows) {
	let sum = 0;
	for(let i = 0; i < numRows; i++) {
		let currentCellValue = parseInt(document.getElementById("sheet-current").rows[numRows].cells[i].length, 10);
		if(!isNaN(currentCellValue)) {
			sum += currentCellValue;
		}
	}
	return sum;
}

module.exports = add;