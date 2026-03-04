// ============================================================
// DOCUMENT ID MAP
// ============================================================
// Maps each policy key (docKey) to its Google Doc ID.
//
// How to find a Google Doc ID:
//   Open the doc in Google Docs
//   Copy the ID from the URL:
//   https://docs.google.com/document/d/[DOC_ID_HERE]/edit
//
// Rules:
//   - Key MUST match a key in POLICY_META (app.html)
//   - Key MUST match a key in NAV_LABELS  (app.html)
//   - Each policy should ideally have its own unique Doc ID
//   - Duplicate IDs are allowed during development (placeholder)
//
// To add a new policy:
//   1. Create a Google Doc
//   2. Copy its ID from the URL
//   3. Add a new line here: 'your_policy_key': 'YOUR_DOC_ID'
//   4. Add matching entry to POLICY_META in app.html
//   5. Add matching entry to NAV_LABELS  in app.html
//   6. Add matching nav item in Index.html sidebar
// ============================================================
// var DOCS = {

//   // ── Section 1: Company Overview ──────────────────────────
//   // Each key has its own dedicated Google Doc
//   'purpose_background':     '1NIzp3NnbLmHowI3cQMXciXqEgedB7Jc2arsnujDjzMk',

//   // ⚠️ Below entries share a placeholder Doc ID
//   // TODO: Replace each with its own dedicated Google Doc ID
//   'company_history':        '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
//   'team_structure':         '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
//   'types_of_content':       '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',

//   // ── Section 2: Security & Compliance ─────────────────────
//   // TODO: Replace with dedicated Doc IDs
//   'office_security':        '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
//   'gdpr_compliance':        '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
//   'internal_communication': '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',

//   // ── Section 3: Sales Playbook ─────────────────────────────
//   // TODO: Replace with dedicated Doc IDs
//   'lead_generation':        '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
//   'guiding_statements':     '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
//   'sales_calls':            '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
//   'creating_proposals':     '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
//   'sales_objections':       '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',

//   // ── Section 4: General Reference ─────────────────────────
//   // TODO: Replace with dedicated Doc ID
//   'faqs':                   '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI'
// };
// ===========================
// DOC ID CONFIG MAP
// ===========================
var DOCS = {
  'purpose_background':     '1NIzp3NnbLmHowI3cQMXciXqEgedB7Jc2arsnujDjzMk',
  'company_history':        '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'team_structure':         '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'types_of_content':       '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'office_security':        '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'gdpr_compliance':        '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'internal_communication': '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'lead_generation':        '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'guiding_statements':     '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'sales_calls':            '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'creating_proposals':     '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'sales_objections':       '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI',
  'faqs':                   '1YpyRZ5Te_3TbCB5GJLXB3DG8oeez8wEkYTWKaRKgIHI'
};

function debugGetPolicyMeta() {
  var ss = SpreadsheetApp.openById('1VZy3i_uRU__VQkR11xdQtP9KUSi3jF8ow-dg6eHqQuU');
  
  // ── Check sheet names ──────────────────────────────────
  var sheets = ss.getSheets().map(function(s) { return s.getName(); });
  Logger.log('Sheet tabs found: ' + JSON.stringify(sheets));

  // ── Check Policies tab ─────────────────────────────────
  var policiesSheet = ss.getSheetByName('Policies');
  if (!policiesSheet) {
    Logger.log('ERROR: No tab named "Policies" — check exact name');
    return;
  }
  var pRows = policiesSheet.getDataRange().getValues();
  Logger.log('Policies rows: ' + pRows.length);
  Logger.log('Policies row 0 (headers): ' + JSON.stringify(pRows[0]));
  Logger.log('Policies row 1 (first data): ' + JSON.stringify(pRows[1]));

  // ── Check Bullets tab ──────────────────────────────────
  var bulletsSheet = ss.getSheetByName('Bullets');
  if (!bulletsSheet) {
    Logger.log('ERROR: No tab named "Bullets" — check exact name');
    return;
  }
  var bRows = bulletsSheet.getDataRange().getValues();
  Logger.log('Bullets rows: ' + bRows.length);
  Logger.log('Bullets row 0 (headers): ' + JSON.stringify(bRows[0]));
  Logger.log('Bullets row 1 (first data): ' + JSON.stringify(bRows[1]));

  // ── Check BulletDetails tab ────────────────────────────
  var detailsSheet = ss.getSheetByName('BulletDetails');
  if (!detailsSheet) {
    Logger.log('ERROR: No tab named "BulletDetails" — check exact name');
    return;
  }
  var dRows = detailsSheet.getDataRange().getValues();
  Logger.log('BulletDetails rows: ' + dRows.length);
  Logger.log('BulletDetails row 0 (headers): ' + JSON.stringify(dRows[0]));
  Logger.log('BulletDetails row 1 (first data): ' + JSON.stringify(dRows[1]));

  // ── Run actual getPolicyMeta and log result ────────────
  var result = getPolicyMeta();
  var keys   = Object.keys(result);
  Logger.log('getPolicyMeta keys returned: ' + keys.length);
  Logger.log('First key: ' + keys[0]);
  Logger.log('First value: ' + JSON.stringify(result[keys[0]]));
}

// ===========================
// SHEET CONFIG
// ===========================
var SHEET_ID = '1VZy3i_uRU__VQkR11xdQtP9KUSi3jF8ow-dg6eHqQuU';

// ===========================
// GET POLICY META FROM SHEET
// Reads Policies, Bullets, BulletDetails tabs
// Returns a POLICY_META object identical
// in shape to the hardcoded version in app.html
// ===========================
function getPolicyMeta() {
  var ss             = SpreadsheetApp.openById(SHEET_ID);
  var policiesSheet  = ss.getSheetByName('Policies');
  var bulletsSheet   = ss.getSheetByName('Bullets');
  var detailsSheet   = ss.getSheetByName('BulletDetails');

  // ── Read all rows ───────────────────────────────────────
  var policies = policiesSheet.getDataRange().getValues();
  var bullets  = bulletsSheet.getDataRange().getValues();
  var details  = detailsSheet.getDataRange().getValues();

  // ── Skip header row (row 0) ─────────────────────────────
  var meta = {};

  // ── 1. Build base policy entries ────────────────────────
  for (var i = 1; i < policies.length; i++) {
    var row      = policies[i];
    var docKey   = row[0].toString().trim();
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
  // Col: A=docKey B=bulletText C=order
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
    if (meta[b.docKey]) {
      meta[b.docKey].bullets.push(b.text);
    }
  });

  // ── 3. Populate bulletDetails ────────────────────────────
  // Col: A=docKey B=bulletText C=title D=body
  //      E=mediaType F=mediaId G=mediaCaption
  //      H=mediaDefault I=slidesId J=videoId K=videoType
  for (var i = 1; i < details.length; i++) {
    var row        = details[i];
    var docKey     = row[0].toString().trim();
    var bulletText = row[1].toString().trim();
    if (!docKey || !bulletText) continue;
    if (!meta[docKey])          continue;

    var title      = row[2].toString().trim();
    var body       = row[3].toString().trim();
    var mediaType  = row[4].toString().trim();
    var mediaId    = row[5].toString().trim();
    var mediaCap   = row[6].toString().trim();
    var mediaDef   = row[7].toString().trim();  // 'slides' or 'video'
    var slidesId   = row[8].toString().trim();
    var videoId    = row[9].toString().trim();
    var videoType  = row[10].toString().trim(); // 'gdrive-video' etc

    // ── Build media object ─────────────────────────────
    var media = null;

    if (mediaType === 'dual') {
      // Has both slides + video tabs
      media = {
        default: mediaDef || 'slides',
        slides: {
          type:    'gslides',
          id:      slidesId,
          caption: ''
        },
        video: {
          type:    videoType || 'gdrive-video',
          id:      videoId,
          caption: ''
        }
      };
    } else if (mediaType && mediaId) {
      // Single media type
      media = {
        type:    mediaType,
        id:      mediaId,
        caption: mediaCap
      };
    } else if (mediaType && !mediaId) {
      // Type set but no ID (e.g. placeholder audio)
      media = {
        type:    mediaType,
        id:      '',
        caption: mediaCap
      };
    }
    // else: media stays null

    meta[docKey].bulletDetails[bulletText] = {
      title: title,
      body:  body,
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
function checkAuthStatus() {
  var status = {
    timestamp: new Date().toISOString(),
    overall:   true,
    services:  {}
  };

  // ── 1. Session ───────────────────────────────────────────
  try {
    var email = Session.getActiveUser().getEmail();
    status.services.session = {
      ok:      true,
      message: 'Authenticated as: ' + (email || '(hidden by domain policy)')
    };
  } catch(e) {
    status.services.session = { ok: false, message: e.message };
    status.overall = false;
  }

  // ── 2. Google Drive ──────────────────────────────────────
  try {
    DriveApp.getFiles().hasNext();
    status.services.drive = { ok: true, message: 'DriveApp accessible' };
  } catch(e) {
    status.services.drive = { ok: false, message: e.message };
    status.overall = false;
  }

  // ── 3. Google Docs — test first real Doc ID ──────────────
  try {
    var firstKey = Object.keys(DOCS)[0];
    var firstId  = DOCS[firstKey];
    var docName  = DocumentApp.openById(firstId).getName();
    status.services.docs = {
      ok:      true,
      message: 'Connected — "' + docName + '" (' + firstKey + ')'
    };
  } catch(e) {
    status.services.docs = { ok: false, message: e.message };
    status.overall = false;
  }

  // ── 4. HtmlService ───────────────────────────────────────
  try {
    HtmlService.createHtmlOutput('<p>test</p>');
    status.services.htmlService = { ok: true, message: 'HtmlService available' };
  } catch(e) {
    status.services.htmlService = { ok: false, message: e.message };
    status.overall = false;
  }

  // ── 5. Doc ID coverage ───────────────────────────────────
  var missingDocs = [];
  Object.keys(DOCS).forEach(function(key) {
    if (!DOCS[key] || DOCS[key].trim() === '') missingDocs.push(key);
  });
  status.services.docIds = {
    ok:      missingDocs.length === 0,
    message: missingDocs.length === 0
      ? 'All ' + Object.keys(DOCS).length + ' doc IDs configured'
      : 'Missing IDs for: ' + missingDocs.join(', ')
  };
  if (missingDocs.length > 0) status.overall = false;

  return status;
}

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

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Allows embedding
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
  var docId = DOCS[docKey];

  if (!docId) {
    return { type: 'error', message: 'No document configured for: ' + docKey };
  }

  return {
    type: 'embed',
    url:  'https://docs.google.com/document/d/' + docId + '/preview'
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

// ===========================
// TABLE → HTML
// ===========================

// ===========================
// TABLE → HTML
// ===========================
function convertTable(table) {
  if (!table || !table.getNumRows) return '';
  if (table.getNumRows() === 0)    return '';

  // ✅ Detect 1-row 1-cell empty table = divider
  if (table.getNumRows() === 1 && table.getRow(0).getNumCells() === 1) {
    var cellText = table.getRow(0).getCell(0).getText().trim();
    if (cellText === '') {
      return '<hr class="doc-divider"/>';
    }
  }

  // ── Normal table ─────────────────────────────────────────
  var html = '<table style="width:100%;border-collapse:collapse;margin:12px 0;">';

  for (var r = 0; r < table.getNumRows(); r++) {
    var row = table.getRow(r);
    html += '<tr>';

    for (var c = 0; c < row.getNumCells(); c++) {
      var cell     = row.getCell(c);
      var cellText = convertInlineText(cell.getChild(0).asParagraph());
      var isHeader = (r === 0);
      var tag      = isHeader ? 'th' : 'td';
      var style    = isHeader
        ? 'padding:8px 12px;border:1px solid #e8ecf2;background:#f8faff;font-weight:700;font-size:13px;text-align:left;'
        : 'padding:8px 12px;border:1px solid #e8ecf2;font-size:13px;';

      html += '<' + tag + ' style="' + style + '">' + cellText + '</' + tag + '>';
    }

    html += '</tr>';
  }

  html += '</table>';
  return html;
}

// ===========================
// INLINE TEXT → HTML
// Handles: bold, italic, underline,
// strikethrough, font color, links
// ===========================
function convertInlineText(element) {
  var html = '';

  for (var i = 0; i < element.getNumChildren(); i++) {
    var child = element.getChild(i);

    // ✅ Skip horizontal rules — handled at paragraph level
    if (child.getType() === DocumentApp.ElementType.HORIZONTAL_RULE) {
      continue;
    }

    if (child.getType() === DocumentApp.ElementType.TEXT) {
      var textEl  = child.asText();
      var raw     = textEl.getText();
      var indices = textEl.getTextAttributeIndices();

      if (indices[indices.length - 1] !== raw.length) {
        indices.push(raw.length);
      }

      for (var j = 0; j < indices.length - 1; j++) {
        var start = indices[j];
        var end   = indices[j + 1];
        var chunk = escapeHtml(raw.substring(start, end));

        var bold      = textEl.isBold(start);
        var italic    = textEl.isItalic(start);
        var underline = textEl.isUnderline(start);
        var strike    = textEl.isStrikethrough(start);
        var fgColor   = textEl.getForegroundColor(start);
        var linkUrl   = textEl.getLinkUrl(start);

        var styles = [];
        if (bold)      styles.push('font-weight:700');
        if (italic)    styles.push('font-style:italic');
        if (underline) styles.push('text-decoration:underline');
        if (strike)    styles.push('text-decoration:line-through');
        if (fgColor)   styles.push('color:' + fgColor);

        var styled = styles.length
          ? '<span style="' + styles.join(';') + '">' + chunk + '</span>'
          : chunk;

        if (linkUrl) {
          styled = '<a href="' + linkUrl + '" target="_blank" style="color:#2563eb;text-decoration:underline;">' + styled + '</a>';
        }

        html += styled;
      }

    } else if (child.getType() === DocumentApp.ElementType.INLINE_IMAGE) {
      html += '<span style="color:#9ca3af;font-size:12px;">[image]</span>';
    }
  }

  return html;
}

// ===========================
// ALIGNMENT HELPER
// ===========================
function getAlignment(alignment) {
  switch (alignment) {
    case DocumentApp.HorizontalAlignment.CENTER: return 'text-align:center;';
    case DocumentApp.HorizontalAlignment.RIGHT:  return 'text-align:right;';
    case DocumentApp.HorizontalAlignment.JUSTIFY: return 'text-align:justify;';
    default: return 'text-align:left;';
  }
}


// ===========================
// ESCAPE HTML SPECIAL CHARS
// ===========================
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}