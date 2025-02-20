const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;
  const supabase = req.supabase;
  const transporter = req.transporter;

  try {
    // Vérifier si l'utilisateur existe
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).send('User not found');
    }

    // Générer un token JWT pour la réinitialisation du mot de passe
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetUrl = `http://127.0.0.1:5500/reset-password.html?token=${token}`;// si clique il rederiger vers /reset-password

    // Envoyer l'e-mail de réinitialisation
    await transporter.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
    });

    res.send('Password reset link sent to your email');
  } catch (error) {
    res.status(500).send('Error sending reset link');
  }
});

module.exports = router;