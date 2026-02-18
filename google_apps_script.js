// ----------------------------------------------------------------------------------
// GOOGLE APPS SCRIPT CODE for Abisam Properties
// ----------------------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Copy ALL this code.
// 2. Go to https://script.google.com/ and open your project.
// 3. Paste this code, replacing everything.
// 4. IMPORTANT: Change the 'RECIPIENT_EMAIL' variable below to YOUR email address.
//
// DEPLOYMENT STEPS (CRITICAL):
// 1. Click "Deploy" > "Manage deployments".
// 2. Click the "Edit" icon (pencil) next to your existing deployment.
// 3. Version: select "New version".  <-- VERY IMPORTANT
// 4. Click "Deploy".
// ----------------------------------------------------------------------------------

// --- CONFIGURATION ---
const RECIPIENT_EMAIL = "abisamproperties@gmail.com"; // <--- CHECK THIS IS CORRECT!
const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE"; // <--- PASTE ID FROM GOOGLE SHEET URL
// ---------------------

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  console.log("--- SCRIPT STARTED ---"); // Log start

  try {
    // FIX: specific spreadsheet by ID because standalone scripts can't use getActiveSpreadsheet()
    if (SPREADSHEET_ID.includes("PASTE_")) {
      throw new Error("You forgot to paste your SPREADSHEET_ID in the script code!");
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

    // 0. AUTO-CREATE HEADERS (if sheet is empty)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Phone", "Property", "Requested Date"]);
    }

    // 1. PARSE INCOMING DATA
    if (!e || !e.postData || !e.postData.contents) {
      console.error("Error: No postData received");
      throw new Error("No postData");
    }

    const data = JSON.parse(e.postData.contents);
    console.log("Received Data:", JSON.stringify(data)); // Log payload

    const { name, phone, property, date, timestamp } = data;

    // 2. APPEND TO GOOGLE SHEET
    try {
      sheet.appendRow([timestamp, name, phone, property, date]);
      console.log("Success: Appended to Sheet");
    } catch (sheetError) {
      console.error("Error appending to Sheet:", sheetError);
    }

    // 3. SEND INSTANT EMAIL NOTIFICATION
    try {
      const subject = `🔥 NEW LEAD: ${name} for ${property}`;
      const body = `
      You have a new inspection inquiry!
      
      👤 Name: ${name}
      📞 Phone: ${phone}
      🏠 Property: ${property}
      📅 Date: ${date}
      
      Follow up immediately!
      WhatsApp Link: https://wa.me/${phone.replace(/\D/g, '')}
      `;

      console.log(`Attempting to send email to: ${RECIPIENT_EMAIL}`);

      MailApp.sendEmail({
        to: RECIPIENT_EMAIL,
        subject: subject,
        body: body
      });

      console.log("Success: Email Sent");

    } catch (emailError) {
      console.error("CRITICAL ERROR SENDING EMAIL:", emailError);
      // We want to know if this fails specifically
    }

    return ContentService.createTextOutput(JSON.stringify({ 'status': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    console.error("GLOBAL SCRIPT ERROR:", e);
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
    console.log("--- SCRIPT FINISHED ---");
  }
}
