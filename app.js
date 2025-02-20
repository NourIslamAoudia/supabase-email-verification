require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');
const verifyRouter = require('./routers/verify');
const registerRouter = require('./routers/register');
const forgotPasswordRouter = require('./routers/forgot-password');
const resetPasswordRouter = require('./routers/reset-password');
const logoutRouter = require('./routers/logout');
const loginRouter = require('./routers/login');

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Middleware pour passer supabase et transporter aux routeurs
// pour chaque requête envoyer à /verify et /register elle envoyer les données de supabase et transporter
app.use((req, res, next) => {
  req.supabase = supabase;
  req.transporter = transporter;
  next();
});

app.use('/verify', verifyRouter);
app.use('/register', registerRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/reset-password', resetPasswordRouter);
app.use('/logout', logoutRouter);
app.use('/login', loginRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});