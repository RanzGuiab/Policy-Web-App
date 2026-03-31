// ===========================
// SHEET CONFIG
// ===========================
var SHEET_ID = '1VZy3i_uRU__VQkR11xdQtP9KUSi3jF8ow-dg6eHqQuU';
var MAX_CELL_LENGTH = 2000;

var TABS = {
  policies:      'Policies',
  docs:          'Docs',
  navLabels:     'NavLabels',
  bullets:       'Bullets',
  bulletDetails: 'BulletDetails',
  helpContent:   'HelpContent',
  accounts:      'Accounts'
};

var TAB_WRITE_CONFIG = {
  policies:      { name: TABS.policies, cols: 5  },
  docs:          { name: TABS.docs, cols: 2  },
  navLabels:     { name: TABS.navLabels, cols: 5  },
  bullets:       { name: TABS.bullets, cols: 3  },
  bulletDetails: { name: TABS.bulletDetails, cols: 11 }
};

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function getTabSheetOrThrow(tabName) {
  var sheet = getSheet().getSheetByName(tabName);
  if (!sheet) throw new Error(tabName + ' tab missing.');
  return sheet;
}

function readTabRows(tabName) {
  var sheet = getSheet().getSheetByName(tabName);
  if (!sheet) return [];
  return sheet.getDataRange().getValues().slice(1);
}

function findRowIndexByFirstColumn(rows, key) {
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString().trim() === key) return i;
  }
  return -1;
}

function sanitiseText(val) {
  return String(val || '').substring(0, MAX_CELL_LENGTH).trim();
}

function sanitiseRow(row, maxCols) {
  var out = [];
  for (var c = 0; c < maxCols; c++) {
    out.push(sanitiseText(row[c]));
  }
  return out;
}

// ===========================
// AUTH — reads from Accounts tab
// ===========================
function getAdminEmails() {
  var rows = readTabRows(TABS.accounts);
  var emails = [];
  for (var i = 0; i < rows.length; i++) {
    var email = rows[i][0].toString().trim().toLowerCase();
    var role = rows[i][1].toString().trim().toLowerCase();
    if (email && role === 'admin') emails.push(email);
  }
  return emails;
}

function isAdmin() {
  var email = Session.getActiveUser().getEmail();
  if (!email) return false;
  return getAdminEmails().indexOf(email.toLowerCase().trim()) > -1;
}

function guardAdmin() {
  if (!isAdmin()) throw new Error('Unauthorised. Admin access only.');
}

// ===========================
// READ — GET ALL ADMIN DATA
// ===========================
function getAdminData() {
  guardAdmin();
  return {
    policies:      readTabRows(TABS.policies),
    docs:          readTabRows(TABS.docs),
    navLabels:     readTabRows(TABS.navLabels),
    bullets:       readTabRows(TABS.bullets),
    bulletDetails: readTabRows(TABS.bulletDetails),
    helpContent:   readHelpContent(),
    accounts:      readTabRows(TABS.accounts)
  };
}

// ===========================
// READ — HELP CONTENT
// ===========================
function readHelpContent() {
  var sheet = getSheet().getSheetByName(TABS.helpContent);
  if (!sheet) return {};

  var rows = sheet.getDataRange().getValues();
  var result = {};

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var key = row[0].toString().trim();
    if (!key) continue;

    var fields = [];
    for (var c = 4; c < row.length; c++) {
      var cell = row[c].toString().trim();
      if (!cell) continue;
      var parts = cell.split('|');
      if (parts.length < 3) continue;
      fields.push({
        name: parts[0].trim(),
        required: parts[1].trim().toLowerCase() === 'true',
        hint: parts.slice(2).join('|').trim()
      });
    }

    result[key] = {
      title: row[1].toString().trim(),
      img: row[2].toString().trim(),
      desc: row[3].toString().trim(),
      fields: fields
    };
  }

  return result;
}

// ===========================
// READ — SECTIONS
// ===========================
function getSections() {
  guardAdmin();
  var rows = readTabRows(TABS.navLabels);
  var seen = {};
  var out = [];
  rows.forEach(function(r) {
    var key = r[2].toString().trim();
    var lbl = r[3].toString().trim();
    if (key && !seen[key]) {
      seen[key] = true;
      out.push({ section: key, sectionLabel: lbl });
    }
  });
  return out;
}

// ===========================
// WRITE — SAVE POLICY
// ===========================
function savePolicy(data) {
  guardAdmin();
  var docKey = validateDocKey(data.docKey);
  var sheet = getTabSheetOrThrow(TABS.policies);
  var rows = sheet.getDataRange().getValues();
  var row = [
    docKey,
    sanitiseText(data.tagline),
    sanitiseText(data.mediaType),
    sanitiseText(data.mediaId),
    sanitiseText(data.mediaCaption)
  ];
  var existingIndex = findRowIndexByFirstColumn(rows, docKey);
  if (existingIndex > -1) {
    sheet.getRange(existingIndex + 1, 1, 1, 5).setValues([row]);
    return { status: 'updated' };
  }
  sheet.appendRow(row);
  return { status: 'created' };
}

// ===========================
// WRITE — SAVE ACCOUNT
// ===========================
function saveAccount(data) {
  guardAdmin();
  if (!data.email) throw new Error('Email is required.');
  var email = data.email.toString().trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format.');
  }

  var role = 'admin';
  var displayName = sanitiseText(data.displayName);
  var sheet = getTabSheetOrThrow(TABS.accounts);
  var rows = sheet.getDataRange().getValues();
  var row = [email, role, displayName];
  var existingIndex = findRowIndexByFirstColumn(rows, email);
  if (existingIndex > -1) {
    sheet.getRange(existingIndex + 1, 1, 1, 3).setValues([row]);
    return { status: 'updated' };
  }
  sheet.appendRow(row);
  return { status: 'created' };
}

// ===========================
// DELETE — ACCOUNT
// ===========================
function deleteAccount(email) {
  guardAdmin();
  var currentEmail = Session.getActiveUser().getEmail().toLowerCase().trim();
  var targetEmail = email.toLowerCase().trim();
  if (targetEmail === currentEmail) {
    throw new Error('You cannot remove your own account.');
  }

  var sheet = getTabSheetOrThrow(TABS.accounts);
  var rows = sheet.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][0].toString().trim().toLowerCase() === targetEmail) {
      sheet.deleteRow(i + 1);
      return { status: 'deleted' };
    }
  }
  return { status: 'not_found' };
}

// ===========================
// WRITE — SAVE HELP CONTENT
// ===========================
function saveHelpEntry(data) {
  guardAdmin();
  if (!data.key) throw new Error('Key is required.');
  var key = data.key.toString().trim();

  var sheet = getTabSheetOrThrow(TABS.helpContent);
  var fields = (data.fields || []).map(function(f) {
    return f.name + '|' + (f.required ? 'true' : 'false') + '|' + f.hint;
  });

  var row = [
    key,
    sanitiseText(data.title),
    sanitiseText(data.img),
    sanitiseText(data.desc)
  ].concat(fields.map(function(f) { return sanitiseText(f); }));

  var rows = sheet.getDataRange().getValues();
  var existingIndex = findRowIndexByFirstColumn(rows, key);
  if (existingIndex > -1) {
    sheet.getRange(existingIndex + 1, 1, 1, sheet.getLastColumn()).clearContent();
    sheet.getRange(existingIndex + 1, 1, 1, row.length).setValues([row]);
    return { status: 'updated' };
  }
  sheet.appendRow(row);
  return { status: 'created' };
}

// ===========================
// COMMIT BATCH
// ===========================
function commitBatch(diff) {
  guardAdmin();
  if (!diff || typeof diff !== 'object') return { status: 'ok' };

  Object.keys(diff).forEach(function(tabKey) {
    var cfg = TAB_WRITE_CONFIG[tabKey];
    if (!cfg) return;
    var sheet = getSheet().getSheetByName(cfg.name);
    if (!sheet) return;

    var rows = diff[tabKey] || [];
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }
    if (rows.length) {
      var clean = rows.map(function(r) { return sanitiseRow(r, cfg.cols); });
      sheet.getRange(2, 1, clean.length, cfg.cols).setValues(clean);
    }
  });

  return { status: 'ok' };
}

// ===========================
// VALIDATION HELPERS
// ===========================
function validateDocKey(docKey) {
  if (!docKey) throw new Error('docKey is required.');
  var value = docKey.toString().trim();
  if (!/^[a-z0-9_]+$/.test(value)) {
    throw new Error('docKey must be lowercase letters, numbers, and underscores only.');
  }
  return value;
}

// ===========================
// SERVE ADMIN APP
// ===========================
function doGet() {
  if (!isAdmin()) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif;padding:40px;text-align:center;">' +
      '<h2>Access Denied</h2>' +
      '<p>You do not have permission to access this page.</p>' +
      '</div>'
    );
  }
  return HtmlService.createTemplateFromFile('admin')
    .evaluate()
    .setTitle('Policy Admin')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}