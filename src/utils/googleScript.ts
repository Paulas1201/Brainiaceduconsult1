export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * BRAINIAC EDUCONSULT - GOOGLE SHEET LEAD CAPTURE SCRIPT
 * ====================================================================
 * Instructions:
 * 1. Open your Google Sheet where you want leads saved.
 * 2. Click Extensions -> Apps Script in the top menu.
 * 3. Delete any existing code and PASTE THIS ENTIRE SCRIPT.
 * 4. Click 'Save' (floppy disk icon).
 * 5. Click 'Deploy' -> 'New deployment'.
 * 6. Choose Select Type (Gear Icon) -> 'Web app'.
 * 7. Set:
 *    - Description: "Brainiac Educonsult Leads API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL for receiving form submissions)
 * 8. Click 'Deploy', authorize permissions, and COPY the Web App URL.
 * 9. Paste the Web App URL into the Brainiac Educonsult Admin Settings panel.
 * ====================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure Headers exist on Row 1 if sheet is blank
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email Address",
        "WhatsApp Number",
        "Exam / Program",
        "Learning Mode",
        "Subjects Selected",
        "Notes",
        "Status"
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    }
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    var timestamp = data.createdAt || new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" });
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var whatsapp = data.whatsapp || "N/A";
    var examType = data.examType || "N/A";
    var learningMode = data.learningMode || "N/A";
    var subjects = Array.isArray(data.subjects) ? data.subjects.join(", ") : (data.subjects || "N/A");
    var notes = data.notes || "";
    
    sheet.appendRow([
      timestamp,
      name,
      email,
      whatsapp,
      examType,
      learningMode,
      subjects,
      notes,
      "NEW ENROLLMENT"
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", message: "Brainiac Educonsult Lead Capture Endpoint is Running!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const DEFAULT_GSHEET_URL = 'https://script.google.com/macros/s/AKfycbxF3jyebVnyHZ8tF-bYPb7zmWxhJcJImAlsZIU7HK22uQMPDPxHXehlVZFa9hIVXoq_/exec';

export function getStoredScriptUrl(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('brainiac_gsheet_url') || DEFAULT_GSHEET_URL;
  }
  return DEFAULT_GSHEET_URL;
}

export function saveStoredScriptUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('brainiac_gsheet_url', url.trim());
  }
}
