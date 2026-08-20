/**
 * Google Apps Script — The Greatest ELESEN Show registracijos forma
 *
 * Diegimas:
 * 1. Sheet → Plėtiniai → Apps Script → įklijuok → Išsaugok
 * 2. Diegti → Naujas diegimas / Nauja versija → Interneto programa
 *      Vykdyti kaip: Aš | Kas turi prieigą: Bet kas (VISI)
 * 3. Nukopijuok /exec URL į js/config.js
 *
 * Po kodo pakeitimo VISADA: Tvarkyti diegimus → pieštukas → Nauja versija → Diegti
 */

var HEADERS = [
  'Laikas',
  'Vardas, pavardė',
  'Telefonas',
  'El. paštas',
  'Miestas',
  'Autobusas'
];

// Stulpelio pločiai (px) — vienodas, tvarkingas vaizdas
var COL_WIDTHS = [160, 220, 140, 240, 120, 100];

function doGet() {
  return ContentService
    .createTextOutput('ELESEN forma veikia')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'empty_body' });
    }

    var data = JSON.parse(e.postData.contents);

    if (data.company) {
      return json_({ ok: true, ignored: true });
    }

    var required = ['vardas', 'telefonas', 'elpastas', 'miestas', 'autobusas'];
    for (var i = 0; i < required.length; i++) {
      var key = required[i];
      if (!data[key] || String(data[key]).trim() === '') {
        return json_({ ok: false, error: 'missing_' + key });
      }
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return json_({ ok: false, error: 'no_spreadsheet' });
    }

    var sheet = ss.getSheetByName('Registracijos') || ss.getSheets()[0];
    ensureHeader_(sheet);

    var nextRow = sheet.getLastRow() + 1;
    // Pirma pažymim telefoną kaip tekstą, tada rašom — nepraranda +
    sheet.getRange(nextRow, 3).setNumberFormat('@');
    sheet.getRange(nextRow, 1, nextRow, HEADERS.length).setValues([[
      Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Vilnius', 'yyyy-MM-dd HH:mm:ss'),
      String(data.vardas).trim(),
      String(data.telefonas).trim(),
      String(data.elpastas).trim().toLowerCase(),
      String(data.miestas).trim(),
      String(data.autobusas).trim()
    ]]);
    formatDataRow_(sheet, nextRow);
    applyColumnLayout_(sheet);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Antraštės + užšaldymas — paleidžiama kiekvieną kartą (saugu) */
function ensureHeader_(sheet) {
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var needsHeader = !first[0] || String(first[0]).trim() === '';

  if (needsHeader && sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else if (needsHeader) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange
    .setFontWeight('bold')
    .setBackground('#2b0710')
    .setFontColor('#f5ece2')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 32);
}

function formatDataRow_(sheet, row) {
  var range = sheet.getRange(row, 1, row, HEADERS.length);
  range
    .setFontFamily('Arial')
    .setFontSize(11)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left')
    .setWrap(false);

  // Telefonas ir el. paštas — tekstas
  sheet.getRange(row, 3).setNumberFormat('@');
  sheet.getRange(row, 4).setNumberFormat('@');
  sheet.getRange(row, 1).setNumberFormat('@');
  sheet.setRowHeight(row, 28);

  // Alternuojanti eilutės spalva
  if (row % 2 === 0) {
    range.setBackground('#fff8f0');
  } else {
    range.setBackground('#ffffff');
  }
}

function applyColumnLayout_(sheet) {
  for (var c = 0; c < COL_WIDTHS.length; c++) {
    sheet.setColumnWidth(c + 1, COL_WIDTHS[c]);
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Vieną kartą rankiniu būdu: sutvarko esamą lentelę */
function formatExistingSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Registracijos') || ss.getSheets()[0];
  ensureHeader_(sheet);
  applyColumnLayout_(sheet);
  var last = sheet.getLastRow();
  for (var r = 2; r <= last; r++) {
    formatDataRow_(sheet, r);
  }
}

/** Testui redaktoriuje */
function testDoPost() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        vardas: 'Testas Testauskas',
        telefonas: '+37060000000',
        elpastas: 'test@example.com',
        miestas: 'Kaunas',
        autobusas: 'Taip',
        company: ''
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}
