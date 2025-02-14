const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  // Supprimer le token JWT ou la session côté frontend
  res.send('Logged out successfully');
});

module.exports = router;