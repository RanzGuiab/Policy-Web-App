// CODE.GS

// ===========================
// SHEET CONFIG
// ===========================
var SHEET_ID = '1VZy3i_uRU__VQkR11xdQtP9KUSi3jF8ow-dg6eHqQuU'; // appsscript.json handles AuthN after forcing it on Handover.

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

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

// ===========================
// GET POLICY META FROM SHEET
// Reads Policies, Bullets, BulletDetails tabs
// Returns a POLICY_META object identical
// in shape to the hardcoded version in app.html
// ===========================
function getPolicyMeta() {
  var ss = getSheet();

  var policies = ss.getSheetByName('Policies').getDataRange().getValues();
  var bullets  = ss.getSheetByName('Bullets').getDataRange().getValues();
  var details  = ss.getSheetByName('BulletDetails').getDataRange().getValues();

  var meta = {};

  // ── 1. Build base policy entries ────────────────────────
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

  // ── 2. Populate bullets (sorted by order col) ───────────
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

  // ── 3. Populate bulletDetails ────────────────────────────
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

// ===========================
// AUTH & INTEGRATION STATUS CHECK
// ===========================
// Verifies all Google services used by this app.
// Call from browser console:
//   google.script.run
//     .withSuccessHandler(function(r){ console.log(r); })
//     .checkAuthStatus();
// Or trigger via the admin Check Auth button.
// ===========================
// function checkAuthStatus() {
//   var status = {
//     timestamp: new Date().toISOString(),
//     overall:   true,
//     services:  {}
//   };

//   // ── 1. Session ───────────────────────────────────────────
//   try {
//     var email = Session.getActiveUser().getEmail();
//     status.services.session = {
//       ok:      true,
//       message: 'Authenticated as: ' + (email || '(hidden by domain policy)')
//     };
//   } catch(e) {
//     status.services.session = { ok: false, message: e.message };
//     status.overall = false;
//   }

//   // ── 2. Google Drive ──────────────────────────────────────
//   try {
//     DriveApp.getFiles().hasNext();
//     status.services.drive = { ok: true, message: 'DriveApp accessible' };
//   } catch(e) {
//     status.services.drive = { ok: false, message: e.message };
//     status.overall = false;
//   }

//   // ── 3. Google Docs — test first real Doc ID ──────────────
//   try {
//     var docs     = getDocs();
//     var firstKey = Object.keys(docs)[0];
//     var firstId  = docs[firstKey];
//     var docName  = DocumentApp.openById(firstId).getName();
//     status.services.docs = {
//       ok:      true,
//       message: 'Connected — "' + docName + '" (' + firstKey + ')'
//     };
//   } catch(e) {
//     status.services.docs = { ok: false, message: e.message };
//     status.overall = false;
//   }

//   // ── 4. HtmlService ───────────────────────────────────────
//   try {
//     HtmlService.createHtmlOutput('<p>test</p>');
//     status.services.htmlService = { ok: true, message: 'HtmlService available' };
//   } catch(e) {
//     status.services.htmlService = { ok: false, message: e.message };
//     status.overall = false;
//   }

//   // ── 5. Doc ID coverage ───────────────────────────────────
//   var missingDocs = [];
//   Object.keys(DOCS).forEach(function(key) {
//     if (!DOCS[key] || DOCS[key].trim() === '') missingDocs.push(key);
//   });
//   status.services.docIds = {
//     ok:      missingDocs.length === 0,
//     message: missingDocs.length === 0
//       ? 'All ' + Object.keys(DOCS).length + ' doc IDs configured'
//       : 'Missing IDs for: ' + missingDocs.join(', ')
//   };
//   if (missingDocs.length > 0) status.overall = false;

//   return status;
// }

// ===========================
// MEDIA ID CHECK
// Called separately by client
// with IDs extracted from POLICY_META
// ===========================
function checkMediaIds(ids) {
  var results = {};
  // ── Youtube ───────────────────────────────────────────────
  if (ids.videoId) {
    // ── YouTube ID — no Drive check needed, just confirm it exists
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
    } else {
      // ── Drive video ID
      try {
        var f = DriveApp.getFileById(ids.videoId);
        results.driveVideo = {
          ok:      true,
          message: '"' + f.getName() + '" — ' + Math.round(f.getSize() / 1024) + ' KB'
        };
      } catch(e) {
        results.driveVideo = { ok: false, message: e.message };
      }
    }
  } else {
    results.driveVideo = { ok: true, message: 'No video ID configured — skipped' };
  }
  // ── Slides ───────────────────────────────────────────────
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

  // ── Drive Video ──────────────────────────────────────────
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

  // ── Drive Image ──────────────────────────────────────────
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

  // ── Drive Audio ──────────────────────────────────────────
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

// FORCE AUTH FOR DEBUG

function forceAuth() {
   var test = UrlFetchApp.fetch('https://www.google.com');
   Logger.log('Auth OK: ' + test.getResponseCode());
}

// ===========================
// SERVE WEB APP
// ===========================
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Company Policies')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ===========================
// INCLUDE HELPER
// ===========================
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ===========================
// FETCH DOC AS FORMATTED HTML
// Preserves: bold, italic, headings,
// bullet lists, numbered lists, spacing
// ===========================
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

// // ✅ Scan every child of a paragraph for HORIZONTAL_RULE
// function containsHorizontalRule(para) {
//   for (var i = 0; i < para.getNumChildren(); i++) {
//     if (para.getChild(i).getType() === DocumentApp.ElementType.HORIZONTAL_RULE) {
//       return true;
//     }
//   }
//   return false;
// }

// // ===========================
// // PARAGRAPH → HTML
// // Handles: Heading 1-6, Normal, with
// // inline bold / italic / underline
// // ===========================
// function convertParagraph(para) {
//   var text = para.getText();
//   if (!text.trim()) return '<br>';  // empty line = line break

//   var heading = para.getHeading();
//   var inlineHtml = convertInlineText(para);
//   var align = getAlignment(para.getAlignment());

//   switch (heading) {
//     case DocumentApp.ParagraphHeading.HEADING1:
//       return '<h1 style="' + align + '">' + inlineHtml + '</h1>';
//     case DocumentApp.ParagraphHeading.HEADING2:
//       return '<h2 style="' + align + '">' + inlineHtml + '</h2>';
//     case DocumentApp.ParagraphHeading.HEADING3:
//       return '<h3 style="' + align + '">' + inlineHtml + '</h3>';
//     case DocumentApp.ParagraphHeading.HEADING4:
//       return '<h4 style="' + align + '">' + inlineHtml + '</h4>';
//     case DocumentApp.ParagraphHeading.HEADING5:
//       return '<h5 style="' + align + '">' + inlineHtml + '</h5>';
//     case DocumentApp.ParagraphHeading.HEADING6:
//       return '<h6 style="' + align + '">' + inlineHtml + '</h6>';
//     default:
//       return '<p style="' + align + '">' + inlineHtml + '</p>';
//   }
// }


// // ===========================
// // LIST ITEM → HTML
// // Handles: bullet + numbered lists,
// // with nesting levels
// // ===========================
// function convertListItem(item) {
//   var inlineHtml = convertInlineText(item);
//   var glyphType = item.getGlyphType();
//   var nestingLevel = item.getNestingLevel();
//   var indent = (nestingLevel * 20) + 'px';

//   var tag = (
//     glyphType === DocumentApp.GlyphType.BULLET ||
//     glyphType === DocumentApp.GlyphType.HOLLOW_BULLET ||
//     glyphType === DocumentApp.GlyphType.SQUARE_BULLET
//   ) ? 'ul' : 'ol';

//   return '<' + tag + ' style="margin-left:' + indent + ';margin:4px 0 4px ' + indent + ';padding-left:20px;">' +
//          '<li>' + inlineHtml + '</li>' +
//          '</' + tag + '>';
// }

// function debugTable(table) {
//   Logger.log('Rows: ' + table.getNumRows());
//   Logger.log('Cols: ' + table.getRow(0).getNumCells());
//   Logger.log('Text: "' + table.getRow(0).getCell(0).getText() + '"');
//   Logger.log('Border: ' + (table.getBorderWidth ? table.getBorderWidth() : 'N/A'));
// }

// ===========================
// VIDEO FETCH — BASE64
// ===========================
// Reads a Drive MP4 file and returns it
// as a base64 data URL for use in <video>.
//
// ⚠️  PERFORMANCE NOTE:
// Base64 encoding adds ~33% size overhead.
// Apps Script is not a media server.
// This works well for files <3MB (720p compressed).
//
// ── Recommended file spec ────────────────────────
//   Format:    MP4
//   Codec:     H.264 video + AAC audio
//   Max res:   720p
//   Target:    <3MB per file
//   Tool:      HandBrake (free) — use preset "Fast 720p30"
//
// ── When to migrate to GCP Cloud Storage ────────
//   When any video exceeds 5MB OR load time > 5s.
//
//   Migration path (zero code change in frontend):
//   1. Create GCP project at console.cloud.google.com
//   2. Create a Cloud Storage bucket (Standard, regional)
//   3. Upload MP4s → make each object public
//   4. In Code.gs replace this function with:
//
//      function getVideoBase64(fileId) {
//        var GCS_BASE = 'https://storage.googleapis.com/YOUR_BUCKET/';
//        var FILE_MAP = {
//          '1k2PGK5O4p5_...': 'intro-video.mp4',
//          '136hKW2YLOXr...': 'mission-video.mp4'
//        };
//        return GCS_BASE + (FILE_MAP[fileId] || fileId + '.mp4');
//      }
//
//   5. In app.html renderMediaBox gdrive-video case,
//      change <source src="...base64..."> to the returned URL.
//      The preloader and cache stay exactly as-is.
//
//   Estimated cost: ~$0.02/GB storage + $0.12/GB egress
//   Free tier:       5GB storage + 1GB egress/month
// =====================================================

function getVideoBase64(fileId) {
  var file  = DriveApp.getFileById(fileId);
  var bytes = file.getBlob().getBytes();
  var b64   = Utilities.base64Encode(bytes);
  return 'data:video/mp4;base64,' + b64;
}