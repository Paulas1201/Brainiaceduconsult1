export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * BRAINIAC EDUCONSULT - OFFICIAL GOOGLE SHEET LEAD CAPTURE SCRIPT
 * ====================================================================
 * Step-by-Step Instructions:
 * 1. Open your Google Sheet where you want leads saved.
 * 2. In the top menu, click: Extensions -> Apps Script.
 * 3. Delete ANY existing code in the editor and PASTE THIS ENTIRE SCRIPT.
 * 4. Click the Save icon (💾 Floppy disk).
 * 5. In the top-right corner, click: Deploy -> New deployment.
 * 6. Click the Gear icon (⚙️ Select type) -> choose "Web app".
 * 7. Configure deployment fields:
 *    - Description: "Brainiac Leads Webhook"
 *    - Execute as: "Me (your-email@gmail.com)"
 *    - Who has access: "Anyone"  <--- ⚠️ VERY IMPORTANT! Must be "Anyone"
 * 8. Click "Deploy", then click "Authorize access" (choose your Google account & click Advanced -> Go to Brainiac Leads (unsafe)).
 * 9. COPY the "Web app URL" (it ends with "/exec").
 * 10. Paste the URL into your Brainiac Educonsult Staff Portal -> Google Sheet Settings!
 * ====================================================================
 */

function handleLeadSubmission(data) {
  var lock = LockService.getScriptLock();
  // Wait up to 15 seconds for any concurrent writes
  lock.tryLock(15000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Prefer sheet named "Leads" or "Brainiac_Leads", fallback to first sheet
    var sheet = ss.getSheetByName("Leads") || ss.getSheetByName("Brainiac_Leads") || ss.getSheets()[0];
    
    // Auto-create and format Header Row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp (WAT)",
        "Full Name",
        "Email Address",
        "WhatsApp / Phone",
        "Target Exam / Program",
        "Learning Mode",
        "Selected Subjects",
        "Candidate Notes",
        "Lead ID",
        "Lead Status"
      ];
      sheet.appendRow(headers);
      
      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#f8fafc");
      headerRange.setFontSize(10);
      sheet.setFrozenRows(1);
    }
    
    // Format timestamp in West Africa Time (Lagos GMT+1)
    var timestampStr = "";
    try {
      timestampStr = Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd HH:mm:ss");
    } catch(err) {
      timestampStr = new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" });
    }
    
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var whatsapp = data.whatsapp || "N/A";
    var examType = data.examType || "General Enquiry";
    var learningMode = data.learningMode || "Online / Flexible";
    var subjects = "";
    if (Array.isArray(data.subjects)) {
      subjects = data.subjects.join(", ");
    } else if (data.subjects) {
      subjects = String(data.subjects);
    } else {
      subjects = "None specified";
    }
    var notes = data.notes || "";
    var leadId = data.id || ("lead_" + new Date().getTime());
    var status = "NEW REGISTRATION";
    
    // Append row
    sheet.appendRow([
      timestampStr,
      name,
      email,
      whatsapp,
      examType,
      learningMode,
      subjects,
      notes,
      leadId,
      status
    ]);
    
    var newRow = sheet.getLastRow();
    
    // Auto-fit columns if under 50 rows
    if (newRow <= 50) {
      for (var col = 1; col <= 10; col++) {
        sheet.autoResizeColumn(col);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        status: "success",
        message: "Lead successfully recorded in Google Sheet",
        row: newRow,
        timestamp: timestampStr
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Handles POST requests (Standard Webhooks)
function doPost(e) {
  var data = {};
  
  if (e && e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      // If not raw JSON, check parameter object
      data = e.parameter || {};
    }
  } else if (e && e.parameter) {
    data = e.parameter;
  }
  
  return handleLeadSubmission(data);
}

// Handles GET requests (Browser fallback & Ping Health Check)
function doGet(e) {
  // If parameters like name, email, or whatsapp are present in GET query, save lead
  if (e && e.parameter && (e.parameter.name || e.parameter.email || e.parameter.whatsapp || e.parameter.data)) {
    var data = e.parameter;
    if (e.parameter.data) {
      try {
        data = JSON.parse(e.parameter.data);
      } catch(err) {
        data = e.parameter;
      }
    }
    return handleLeadSubmission(data);
  }
  
  // Health check ping
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      result: "success",
      message: "Brainiac Educonsult Google Sheet Webhook is active and ready to receive leads!",
      timestamp: new Date().toISOString()
    }))
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
