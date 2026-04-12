import { google } from 'googleapis';
import path from 'path';

type ContactData = {
    name: string;
    email: string;
    message: string;
}

export default async function saveToGoogleSheets({name, email, message}: ContactData) {
     try {
      const auth = new google.auth.GoogleAuth({
        keyFile: path.join(process.cwd(), 'google.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'EzydragAI',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [name, email, message, new Date().toLocaleDateString(), new Date().toLocaleTimeString(), "No"]
          ]
        }
      });

    } catch (sheetError) {
      console.error('Failed to save to Google Sheets:', sheetError);
      throw new Error('Failed to save data. Please ensure Google Sheets credentials are correct.');
    }
}