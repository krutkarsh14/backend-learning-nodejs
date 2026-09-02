const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// 1. Authentication ka matlab hai "Pehchan karna" (Verifying who the user is).
// 2. Authorization ka matlab hai "Ijazat dena" (What the user is allowed to do).

const users = []; // In-memory database (Sirf samjhane ke liye)
const SECRET_KEY = "mera_super_secret_key_jo_kisi_ko_nahi_batana";

// ==========================================
// 1. Registration (Sign Up)
// ==========================================
// Yahan naya user apna account banata hai. Hum password ko seedhe save nahi karte (security risk).
// Hum usko "hash" (encrypt) karte hain bcrypt package se.
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "User pehle se maujood hai!" });
        }

        // Hashing password: password ko ek random string me badal deta hai.
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user (password ki jagah hashed password save kar rahe hain)
        const newUser = { username, password: hashedPassword };
        users.push(newUser);

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ==========================================
// 2. Login (Sign In)
// ==========================================
// Yahan user apna username aur password deta hai.
// Agar dono sahi hain, toh hum usko ek "Token" (JWT) dete hain, jo uski aage ki requests me entry pass ka kaam karega.
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Step 1: User dhundo
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: "User nahi mila!" });
        }

        // Step 2: Password check karo
        // (Jo password user ne abhi daala VS jo database me hash bacha hua hai, bcrypt check karta hai ki dono match hote hain ya nahi)
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Galat password!" });
        }

        // Step 3: Token banana (JWT - JSON Web Token)
        // Ye ek digital ticket ki tarah hai. Isme hum user ki thodi bohot info (payload) aur ek 'secret key' daalte hain.
        // Ye secret key sirf server ko pata hoti hai, jis se aage server verify karega ki ye token asli hai ya fake.
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' }); // 1 ghante me expire hoga

        res.status(200).json({ message: "Login successful!", token: token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ==========================================
// 3. Middleware (The Guard)
// ==========================================
// Ye function check karega ki user ke paas valid "ticket" (Token) hai ya nahi, kisi protected route par aane se pehle.
const authenticateToken = (req, res, next) => {
    // Header se token nikalna. Standard format hai: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Sirf token wala part nikala

    if (!token) {
        return res.status(401).json({ message: "Token nahi diya gaya, Access Denied!" }); // 401 Unauthorized
    }

    // Token verify karna
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid ya Expired Token!" }); // 403 Forbidden
        }

        // Agar token sahi hai, toh req.user me user ki details daal do taaki aage dashboard wagarah me access ho
        req.user = user;

        // next() call karne ka matlab hai ki sab theek hai, aage badhne do.
        next();
    });
};

// ==========================================
// 4. Protected Route (Secure Data)
// ==========================================
// Ye route sirf wahi access kar sakta hai jiske paas valid token hoga. 
// Hum yahan `authenticateToken` middleware pass kar rahe hain as a guard.
app.get('/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: `Welcome to Dashboard, ${req.user.username}! Ye ek secure aur protected data hai.` });
});

// Server start karna
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// MongoDB package se MongoClient import karo
//const express = require("express");
const { MongoClient } = require("mongodb");



const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

app.get("/mammals", async (req, res) => {
  try {
    await client.connect();

    const db = client.db("animals");
    const mammals = await db.collection("mammals").find().toArray();

    res.json(mammals); // Postman ko data bhej do
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});