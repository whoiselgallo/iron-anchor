const express = require('express');
const router = express.Router();
const { getGoogleAuthUrl, googleAuthCallback, getDriveFiles } = require('../controllers/mediaController');

router.get('/google/auth', getGoogleAuthUrl);
router.get('/google/callback', googleAuthCallback);
router.get('/google/files', getDriveFiles);

module.exports = router;
