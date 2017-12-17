class TableModel {
  constructor(numCols=10, numRows=21) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.data = {};
  }

  _getCellId(location) {
    return `${location.col}:${location.row}`;
  }

  getValue(location) {
    return this.data[this._getCellId(location)];
  }

  setValue(location, value) {
    this.data[this._getCellId(location)] = value;
  }

  getNumRows() {
    return numRows;
  }

  changeRows() {
    this.numRows++;
  }

  changeCols() {
    this.numCols++;
  }
}

module.exports = TableModel;