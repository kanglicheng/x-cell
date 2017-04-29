const { getLetterRange } = require('./array-util');
const { removeChildren, createTR, createTH, createTD} = require('./dom-util');
const add = require('./adder.js');

class TableView {
	constructor(model) {
		this.model = model;
	}

	init() {
		this.initDomReference();
		this.initCurrentCell();
		this.renderTable();
		this.attachEventHandlers();
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
		getLetterRange('A', this.model.numRows)
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

	renderTableFooter() {
		let i = 0;
		while(i <= this.model.numRows) {
			removeChildren(this.footerRowEl);
			let sum = add(i, this.model.numCols)
			   .map(colLable => createTH(colLable))
			   .forEach(th => this.footerRowEl.appendChild(th));
			i++;
		}
	}

	attachEventHandlers() {
		this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
		this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
	}

	handleFormulaBarChange(evt) {
		const value = this.formulaBarEl.value;
		this.model.setValue(this.currentCellLocation, value);
		this.renderTableBody();
	}

	handleSheetClick(evt) {
		const col = evt.target.cellIndex;
		const row = evt.target.parentElement.rowIndex -1;

		this.currentCellLocation = { col: col, row: row};
		this.renderTableBody();
		this.renderFormulaBar();
	}

}

module.exports = TableView;