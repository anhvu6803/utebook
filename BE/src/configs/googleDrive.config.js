const { google } = require('googleapis');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.GOOGLE_DRIVE_TYPE,
    project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

module.exports = { drive }; 