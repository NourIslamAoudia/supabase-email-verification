const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const supabase = req.supabase;

  try {
    // Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Mettre à jour le mot de passe de l'utilisateur
    const { data: user, error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('email', email)
      .select();

    if (error || !user) {
      return res.status(400).send('Invalid token or user not found');
    }

    res.send('Password reset successfully');
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

module.exports = router;