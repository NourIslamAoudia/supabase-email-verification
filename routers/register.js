const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res) => {
// Récupération des données du formulaire
  const { username, email, password } = req.body;
  const supabase = req.supabase;
  const transporter = req.transporter;

  try {
    // Insertion de l'utilisateur dans la base de données
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password}])
      .select();

    if (error) throw error;

    const user = data[0];
    // Création du token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // URL de vérification
    const url = `https://supabase-email-verification.vercel.app/verify/${token}`;

    // Envoi du mail de vérification
    await transporter.sendMail({
      to: user.email,
      subject: 'Verify your email',
      html: `Click <a href="${url}">here</a> to verify your email.`,//si clique il appele le endpoint /verify
    });
    
    // Réponse au client
    res.send('Registration successful, please check your email to verify your account');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

module.exports = router;