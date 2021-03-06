const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {

  beforeEach(() => {
      // load HTML skeleton from disk and parse into the DOM
      const fixturePath = './client/js/test/fixtures/sheet-container.html';
      const html = fs.readFileSync(fixturePath, 'utf8');
      document.documentElement.innerHTML = html;
    });
  describe('formula bar', () => {
    it('makes changes TO the value of the current cell', () => {
      // set up the initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[0].cells[0];
      expect(td.textContent).toBe('');

      // simulate user action
      document.querySelector('#formula-bar').value = '65';
      view.handleFormulaBarChange();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      expect(trs[0].cells[0].textContent).toBe('65');
    });

    it('updates FROM the value of the current cell', () => {
      // set up the initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({col:2, row:1}, '123');
      view.init();

      // inspect the initial state
      const formulaBarEl = document.querySelector('#formula-bar');
      expect(formulaBarEl.value).toBe('');

      // simulate user action
      const trs = document.querySelectorAll('TBODY TR');
      trs[1].cells[2].click();

      // inspect the resulting state
      expect(formulaBarEl.value).toBe('123');
    });
  });

  describe('table body', () => {
    it('highlights the current cell when clicked', () => {
      // set up the initial state
      const model = new TableModel(10, 5);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[2].cells[3];
      expect(td.className).toBe('');

      // simulate user action
      td.click();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      td = trs[2].cells[3];
      expect(td.className).not.toBe('');
    });

    it('has the right size', () => {
      // set up the inital state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the inital state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);
    })

    it('fills in values from the model', () => {
      // set up the inital state
      const model = new TableModel(3, 3,);
      const view = new TableView(model);
      model.setValue({col: 2, row: 1}, '123');
      view.init();

      // inspect the inital state
      const trs = document.querySelectorAll('TBODY TR');
      expect(trs[1].cells[2].textContent).toBe('123');
    })
  })

  describe('table header', () => {
    it('has valid column header labels', () => {
      // set up the initial state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);

      let lableTexts = Array.from(ths).map(el => el.textContent);
      expect(lableTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
    });
  });

  describe('table footer', () => {
    it('adds column values to get sum for footer', () => {
      // set up the initial state
      const columnValues = [1,2,3,4,5,6,7];
      const model = new TableModel(1,8);
      const view = new TableView(model);
      view.init();


      for (var i = 1; i < columnValues.length+1; i++) {
        document.getElementById("sheet-current").rows[i].cells[0].textContent = columnValues[i-1];
      }

      // inspect the initial state
      view.renderTableFooter();
      let trs = parseInt(document.querySelectorAll('TFOOT TD')[0].textContent);
      expect(trs).toBe(28);
    });
  });

  describe('add row button', () => {
    it('adds a row when button is clicked', () => {
      // set up the initial state
      const model = new TableModel(3,3);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      var ths = document.querySelectorAll("TBODY TR").length;
      expect(ths).toBe(3);

      // simulate user action
      let td = document.getElementById("add-row");
      td.click();
      
      // inspect the resulting state
      ths = document.querySelectorAll("TBODY TR").length;
      expect(ths).toBe(4);
    });
  });

  describe('add column button', () => {
    it('adds a column when button is clicked', () => {
      // set up the initial state
      const model = new TableModel(3,3);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      var ths = document.querySelectorAll("TBODY TD").length/document.querySelectorAll("TBODY TR").length;
      expect(ths).toBe(3);

      // simulate user action
      let td = document.getElementById("add-col");
      td.click();
      
      // inspect the resulting state
      ths = document.querySelectorAll("TBODY TD").length/document.querySelectorAll("TBODY TR").length;
      expect(ths).toBe(4);
    });
  });
});