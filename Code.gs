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
    return '<p style="color:#9ca3af;font-style:italic;">No document configured for: ' + docKey + '</p>';
  }

  try {
    var doc  = DocumentApp.openById(docId);
    var body = doc.getBody();
    var html = '';

    for (var i = 0; i < body.getNumChildren(); i++) {
      var child = body.getChild(i);
      var type  = child.getType();

      if (type === DocumentApp.ElementType.PARAGRAPH) {
        var para = child.asParagraph();

        // ✅ Check ALL children of paragraph for horizontal rule
        if (containsHorizontalRule(para)) {
          html += '<hr class="doc-divider"/>';
        } else {
          html += convertParagraph(para);
        }

      } else if (type === DocumentApp.ElementType.LIST_ITEM) {
        html += convertListItem(child.asListItem());

      } else if (type === DocumentApp.ElementType.TABLE) {
        html += convertTable(child.asTable());
      }
    }

    return html || '<p style="color:#9ca3af;font-style:italic;">This document is empty.</p>';

  } catch (e) {
    return '<p style="color:#dc2626;font-style:italic;">Error loading document: ' + e.message + '</p>';
  }
}

// ✅ Scan every child of a paragraph for HORIZONTAL_RULE
function containsHorizontalRule(para) {
  for (var i = 0; i < para.getNumChildren(); i++) {
    if (para.getChild(i).getType() === DocumentApp.ElementType.HORIZONTAL_RULE) {
      return true;
    }
  }
  return false;
}

// ===========================
// PARAGRAPH → HTML
// Handles: Heading 1-6, Normal, with
// inline bold / italic / underline
// ===========================
function convertParagraph(para) {
  var text = para.getText();
  if (!text.trim()) return '<br>';  // empty line = line break

  var heading = para.getHeading();
  var inlineHtml = convertInlineText(para);
  var align = getAlignment(para.getAlignment());

  switch (heading) {
    case DocumentApp.ParagraphHeading.HEADING1:
      return '<h1 style="' + align + '">' + inlineHtml + '</h1>';
    case DocumentApp.ParagraphHeading.HEADING2:
      return '<h2 style="' + align + '">' + inlineHtml + '</h2>';
    case DocumentApp.ParagraphHeading.HEADING3:
      return '<h3 style="' + align + '">' + inlineHtml + '</h3>';
    case DocumentApp.ParagraphHeading.HEADING4:
      return '<h4 style="' + align + '">' + inlineHtml + '</h4>';
    case DocumentApp.ParagraphHeading.HEADING5:
      return '<h5 style="' + align + '">' + inlineHtml + '</h5>';
    case DocumentApp.ParagraphHeading.HEADING6:
      return '<h6 style="' + align + '">' + inlineHtml + '</h6>';
    default:
      return '<p style="' + align + '">' + inlineHtml + '</p>';
  }
}


// ===========================
// LIST ITEM → HTML
// Handles: bullet + numbered lists,
// with nesting levels
// ===========================
function convertListItem(item) {
  var inlineHtml = convertInlineText(item);
  var glyphType = item.getGlyphType();
  var nestingLevel = item.getNestingLevel();
  var indent = (nestingLevel * 20) + 'px';

  var tag = (
    glyphType === DocumentApp.GlyphType.BULLET ||
    glyphType === DocumentApp.GlyphType.HOLLOW_BULLET ||
    glyphType === DocumentApp.GlyphType.SQUARE_BULLET
  ) ? 'ul' : 'ol';

  return '<' + tag + ' style="margin-left:' + indent + ';margin:4px 0 4px ' + indent + ';padding-left:20px;">' +
         '<li>' + inlineHtml + '</li>' +
         '</' + tag + '>';
}

function debugTable(table) {
  Logger.log('Rows: ' + table.getNumRows());
  Logger.log('Cols: ' + table.getRow(0).getNumCells());
  Logger.log('Text: "' + table.getRow(0).getCell(0).getText() + '"');
  Logger.log('Border: ' + (table.getBorderWidth ? table.getBorderWidth() : 'N/A'));
}

function getVideoBase64(fileId) {
  var file  = DriveApp.getFileById(fileId);
  var bytes = file.getBlob().getBytes();
  var b64   = Utilities.base64Encode(bytes);
  return 'data:video/mp4;base64,' + b64;
}

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