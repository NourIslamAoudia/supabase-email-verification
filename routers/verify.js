const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/:token', async (req, res) => {
  const { token } = req.params;
  const supabase = req.supabase;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const { data, error } = await supabase
      .from('users')
      .update({ verified: true })
      .eq('email', email)
      .select();

    if (error || data.length === 0) {
      return res.status(400).send('Invalid token or user not found');
    }

    res.send('Email verified successfully');
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

module.exports = router;