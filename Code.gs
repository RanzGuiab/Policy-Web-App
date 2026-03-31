// CODE.GS
// Portfolio-safe backend for a spreadsheet-driven policy portal.
// Set this to your own Google Sheet ID before deployment.
var SHEET_ID = '1VZy3i_uRU__VQkR11xdQtP9KUSi3jF8ow-dg6eHqQuU';

// Open source spreadsheet.
function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

// Read doc key -> doc ID mapping.
function getDocs() {
  var rows  = getSheet().getSheetByName('Docs').getDataRange().getValues();
  var docs  = {};

  for (var i = 1; i < rows.length; i++) {
    var docKey = rows[i][0];
    var docId  = rows[i][1];
    if (docKey && docId) {
      docs[docKey] = docId;
    }
  }

  return docs;
}

// Read sidebar labels and section metadata.
function getNavLabels() {
  var sheet = getSheet().getSheetByName('NavLabels');

  if (!sheet) throw new Error('Sheet tab missing: "NavLabels"');

  var rows   = sheet.getDataRange().getValues();
  var result = [];

  for (var i = 1; i < rows.length; i++) {
    var row    = rows[i];
    var docKey = row[0].toString().trim();
    var label  = row[1].toString().trim();
    var secKey = row[2].toString().trim();
    var secLbl = row[3].toString().trim();
    var order  = parseInt(row[4]) || i;

    if (!docKey || !label) continue;

    result.push({
      docKey:       docKey,
      label:        label,
      section:      secKey,
      sectionLabel: secLbl,
      order:        order
    });
  }

  // Sort by order column
  result.sort(function(a, b) { return a.order - b.order; });

  return result;
}

// Read policy metadata, bullets, and bullet detail records.
function getPolicyMeta() {
  var ss = getSheet();

  var policiesSheet = ss.getSheetByName('Policies');
  var bulletsSheet  = ss.getSheetByName('Bullets');
  var detailsSheet  = ss.getSheetByName('BulletDetails');

  if (!policiesSheet) throw new Error('Sheet tab missing: "Policies"');
  if (!bulletsSheet)  throw new Error('Sheet tab missing: "Bullets"');
  if (!detailsSheet)  throw new Error('Sheet tab missing: "BulletDetails"');

  var policies = ss.getSheetByName('Policies').getDataRange().getValues();
  var bullets  = ss.getSheetByName('Bullets').getDataRange().getValues();
  var details  = ss.getSheetByName('BulletDetails').getDataRange().getValues();

  var meta = {};

  for (var i = 1; i < policies.length; i++) {
    var row    = policies[i];
    var docKey = row[0].toString().trim();
    if (!docKey) continue;

    meta[docKey] = {
      tagline:       row[1].toString().trim(),
      media: {
        type:        row[2].toString().trim(),
        id:          row[3].toString().trim(),
        caption:     row[4].toString().trim()
      },
      bullets:       [],
      bulletDetails: {}
    };
  }

  var bulletRows = [];
  for (var i = 1; i < bullets.length; i++) {
    var row = bullets[i];
    if (!row[0]) continue;
    bulletRows.push({
      docKey: row[0].toString().trim(),
      text:   row[1].toString().trim(),
      order:  parseInt(row[2]) || i
    });
  }
  bulletRows.sort(function(a, b) { return a.order - b.order; });

  bulletRows.forEach(function(b) {
    if (meta[b.docKey]) meta[b.docKey].bullets.push(b.text);
  });

  for (var i = 1; i < details.length; i++) {
    var row        = details[i];
    var docKey     = row[0].toString().trim();
    var bulletText = row[1].toString().trim();
    if (!docKey || !bulletText) continue;
    if (!meta[docKey])          continue;

    var mediaType = row[4].toString().trim();
    var mediaId   = row[5].toString().trim();
    var media     = null;

    if (mediaType === 'dual') {
      media = {
        default: row[7].toString().trim() || 'slides',
        slides:  { type: 'gslides',              id: row[8].toString().trim(),  caption: '' },
        video:   { type: row[10].toString().trim() || 'gdrive-video', id: row[9].toString().trim(), caption: '' }
      };
    } else if (mediaType && mediaId) {
      media = { type: mediaType, id: mediaId,   caption: row[6].toString().trim() };
    } else if (mediaType && !mediaId) {
      media = { type: mediaType, id: '',         caption: row[6].toString().trim() };
    }

    meta[docKey].bulletDetails[bulletText] = {
      title: row[2].toString().trim(),
      body:  row[3].toString().trim(),
      media: media
    };
  }

  return meta;
}

function checkMediaIds(ids) {
  var results = {};

  if (ids.videoId) {
    if (ids.videoId.length < 20) {
      try {
        var ytUrl = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + ids.videoId + '&format=json';
        var resp  = UrlFetchApp.fetch(ytUrl, { muteHttpExceptions: true });
        results.driveVideo = resp.getResponseCode() === 200
          ? { ok: true,  message: 'YouTube video reachable' }
          : { ok: false, message: 'YouTube video not found or private' };
      } catch(e) {
        results.driveVideo = { ok: false, message: e.message };
      }
    } 
  } else {
    results.driveVideo = { ok: true, message: 'No video ID configured — skipped' };
  }

  if (ids.slidesId) {
    try {
      var name = SlidesApp.openById(ids.slidesId).getName();
      results.slides = { ok: true, message: 'Connected — "' + name + '"' };
    } catch(e) {
      results.slides = { ok: false, message: e.message };
    }
  } else {
    results.slides = { ok: true, message: 'No Slides ID configured — skipped' };
  }

  if (ids.videoId) {
    try {
      var f = DriveApp.getFileById(ids.videoId);
      results.driveVideo = {
        ok:      true,
        message: '"' + f.getName() + '" — ' + Math.round(f.getSize() / 1024) + ' KB'
      };
    } catch(e) {
      results.driveVideo = { ok: false, message: e.message };
    }
  } else {
    results.driveVideo = { ok: true, message: 'No video ID configured — skipped' };
  }

  if (ids.imageId) {
    try {
      var fi = DriveApp.getFileById(ids.imageId);
      results.driveImages = { ok: true, message: '"' + fi.getName() + '"' };
    } catch(e) {
      results.driveImages = { ok: false, message: e.message };
    }
  } else {
    results.driveImages = { ok: true, message: 'No image ID configured — skipped' };
  }

  if (ids.audioId) {
    try {
      var fa = DriveApp.getFileById(ids.audioId);
      results.driveAudio = { ok: true, message: '"' + fa.getName() + '"' };
    } catch(e) {
      results.driveAudio = { ok: false, message: e.message };
    }
  } else {
    results.driveAudio = { ok: true, message: 'No audio ID configured — skipped' };
  }

  return results;
}

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Policy Atlas Showcase')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getDocContent(docKey) {

  // ── Sanitize docKey — alphanumeric + underscore only ──
  var safeKey = String(docKey).replace(/[^a-zA-Z0-9_]/g, '');
  if (!safeKey) {
    return { type: 'error', message: 'Invalid document key.' };
  }

  var docs  = getDocs();
  var docId = docs[safeKey];

  if (!docId) {
    return { type: 'error', message: 'No document configured for: ' + safeKey };
  }

  // ── Validate docId — Google Doc IDs are alphanumeric + hyphens only ──
  var safeDocId = String(docId).replace(/[^a-zA-Z0-9_\-]/g, '');
  if (!safeDocId || safeDocId !== docId) {
    return { type: 'error', message: 'Invalid document ID in configuration.' };
  }

  return {
    type: 'embed',
    url:  'https://docs.google.com/document/d/' + safeDocId + '/preview?rm=minimal'
  };
}

function getVideoBase64(fileId) {
  var file     = DriveApp.getFileById(fileId);
  var blob     = file.getBlob();
  var mimeType = blob.getContentType() || 'video/mp4';
  var b64      = Utilities.base64Encode(blob.getBytes());
  return 'data:' + mimeType + ';base64,' + b64;
}