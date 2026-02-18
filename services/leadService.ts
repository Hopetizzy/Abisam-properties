import { ABISAM_PHONE } from '../constants';

export interface LeadData {
    name: string;
    phone: string;
    property: string;
    date: string;
    timestamp: string;
}

export const pushToGoogleSheets = async (leadData: LeadData) => {
    // TODO: Replace with your actual Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyoKvevbyxwXs9zyAjlcI2JJlau_AeTXlN_n9-kjhE0YhcaoPr3N2AM7YVp8_6WKwrIQA/exec';

    try {
        // Use 'no-cors' mode for Google Forms/Scripts to avoid CORS errors in frontend
        // Note: You won't get a readable response in 'no-cors' mode, but the request will be sent.
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData),
        });

        console.log("Lead data pushed to Google Sheets (silent trigger):", leadData);
        return true;
    } catch (error) {
        console.error("Failed to push lead to Google Sheets:", error);
        return false;
    }
};

export const openWhatsAppInquiry = (leadData: LeadData) => {
    const message = `Hello Abisam Properties,\n\nI am interested in the *${leadData.property}*.\nI would like to schedule an inspection for *${leadData.date}*.\n\nMy Details:\nName: ${leadData.name}\nPhone: ${leadData.phone}\n\nPlease confirm my appointment.`;

    // Clean phone number (remove + or spaces if needed, but ABISAM_PHONE should be clean)
    const url = `https://wa.me/${ABISAM_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};
