const admin = require('firebase-admin');
const path = require('path');
// const serviceAccount = require('./serviceAccountKey.json');

const initializeFirebaseAdmin = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_KEY))
      });
      console.log('Firebase Admin initialized successfully');
    }
    return admin;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
};

module.exports = initializeFirebaseAdmin();