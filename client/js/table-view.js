const { getLetterRange } = require('./array-util');
const { removeChildren, createTR, createTH, createTD} = require('./dom-util');
const { TableModel } = require('./table-model');

class TableView {
	constructor(model) {
		this.model = model;
	}

	init() {
		this.initDomReference();
		this.initCurrentCell();
		this.renderTable();
		this.attachEventHandlers();
		this.addButtonHandlers();
	}

	initDomReference() {
		this.headerRowEl = document.querySelector('THEAD TR');
		this.sheetBodyEl = document.querySelector('TBODY');
		this.formulaBarEl = document.querySelector('#formula-bar');
		this.footerRowEl = document.querySelector('TFOOT TR');
	}

	initCurrentCell() {
		this.currentCellLocation = { col: 0, row: 0};
		this.renderFormulaBar();
	}

	normalizeValueForRendering(value) {
		return value || '';
	}

	renderFormulaBar() {
		const currentCellValue = this.model.getValue(this.currentCellLocation);
		this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
		this.formulaBarEl.focus();
	}

	isCurrentCell(col, row) {
		return this.currentCellLocation.col === col &&
		       this.currentCellLocation.row === row;
	}

	renderTable() {
		this.renderTableHeader();
		this.renderTableBody();
		this.renderTableFooter();
	}

	renderTableHeader() {
		removeChildren(this.headerRowEl);
		getLetterRange('A', this.model.numCols)
		   .map(colLable => createTH(colLable))
		   .forEach(th => this.headerRowEl.appendChild(th));
	}

	renderTableBody() {
		const fragment = document.createDocumentFragment();
		for(let row = 0; row < this.model.numRows; row++) {
			const tr = createTR();
			for(let col = 0; col < this.model.numCols; col++) {
				const position = {col: col, row: row};
				const value = this.model.getValue(position);
				const td = createTD(value);

				if(this.isCurrentCell(col, row)) {
					td.className = 'current-cell';
				}
				tr.appendChild(td);
			}
			fragment.appendChild(tr);
		}
		removeChildren(this.sheetBodyEl);
		this.sheetBodyEl.appendChild(fragment);
	}

	getValuesForColumn(colIndex) {
		let value = 0;
		for(let i=1; i<this.model.numRows; i++){ 
			let columnValue = document.getElementById("sheet-current").rows[i].cells[colIndex].textContent;
			for(var x=0; x<columnValue.length; x++){
				if(!isNaN(columnValue[x])){
					value += parseInt(columnValue);
				}
			}
		}
		return value;
	}

	renderTableFooter() {
		let sum = [];
		let i = 0;
		while(i < this.model.numCols) {
			sum[i] = this.getValuesForColumn(i);
			i++;
		}
		removeChildren(this.footerRowEl);
		sum.map(colLable => createTD(colLable))
		   .forEach(td => this.footerRowEl.appendChild(td));
	}

	attachEventHandlers() {
		this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
		this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
	}

	handleFormulaBarChange(evt) {
		const value = this.formulaBarEl.value;
		this.model.setValue(this.currentCellLocation, value);
		this.renderTableBody();
		this.renderTableFooter();
	}

	handleSheetClick(evt) {
		const col = evt.target.cellIndex;
		const row = evt.target.parentElement.rowIndex -1;

		this.currentCellLocation = { col: col, row: row};
		this.renderTableBody();
		this.renderFormulaBar();
		this.renderTableFooter();
	}

	handleFooterRowEl(evt) {
		const value = this.footerRowEl.value;
		this.model.setValue(this.currentCellLocation, value);
	}
	
	addButtonHandlers() {
		let addRowEl = document.getElementById('add-row');
		let addColEl = document.getElementById('add-col');

		addRowEl.addEventListener('click', this.addRow.bind(this));
		addColEl.addEventListener('click', this.addCol.bind(this));
	}

	addRow(evt) {
		this.model.changeRows();
		this.renderTableBody();
		this.renderTableFooter();
	}

	addCol(evt) {
		this.model.changeCols();
		this.renderTableBody();
		this.renderTableHeader();
		this.renderTableFooter();
	}

}

module.exports = TableView;