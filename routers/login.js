const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const supabase = req.supabase;

  try {
    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !user) {
      return res.status(400).send('Invalid email or password');
    }

    // Vérifier si l'e-mail est vérifié
    if (!user.verified) {
      return res.status(400).send('Please verify your email before logging in');
    }

    res.send('Login successful');
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

module.exports = router;