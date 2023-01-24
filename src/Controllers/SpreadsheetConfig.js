// Not being used at the moment.


// const spreadsheetConfig=(req, res, next)=>{

//         const spreadheetId = '1HBoodN9tB2tpLVA4DP0KIJJovVphyZEYQgDwaexooc4';
//         const { google } = require('googleapis');
//         const auth = new google.auth.GoogleAuth({
//           keyFile: 'credentials.json',
//           scopes: 'https://www.googleapis.com/auth/spreadsheets'
//         });
//         auth.getClient()
//           .then((client) => {
//             req.spreadsheetClient = google.sheets({ version: 'v4', auth: client });
//             req.spreadsheetId = spreadheetId;
//             console.log('Client was succesfully identified')
//             next();
//           })
//           .catch((err) => {
//             console.error(err);
//             res.status(500).json({ message: 'Failed to authenticate with Google Sheets API' });
//           });
      
//   }
  
//   module.exports =spreadsheetConfig