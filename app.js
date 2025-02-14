require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');
const verifyRouter = require('./routers/verify');
const registerRouter = require('./routers/register');

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
app.use((req, res, next) => {
  req.supabase = supabase;
  req.transporter = transporter;
  next();
});
app.use('/verify', verifyRouter);
app.use('/register', registerRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});