import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from "../db.js"
import { configDotenv } from 'dotenv';
configDotenv();



const JWT_SECRET = process.env.JWT_SECRET;

export const register = (async (req, res) => {
  const { email, password, name, country } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password, name, country) VALUES ($1, $2, $3, $4)',
      [email, hash, name, country]
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});



export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        console.log(`Login failed: User with email ${email} not found.`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log(`Login failed: Incorrect password for user ${email}.`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
      console.log(`User ${email} logged in successfully.`);
  
      res.json({ token, uid: user.id }); // ✅ Include uid in response
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // ... existing imports and config ...

export const getUserDetails = async (req, res) => {
  const userId = req.params.id;
  console.log(req.params ,"abcd")
  console.log(userId); // Log the userId for debugging purposes
  try {
    // Verify the requesting user has access to these details
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded,userId,"abcd"); 
    if (decoded.id != userId) {
      console.log(decoded.id ,userId);
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Get user details from database
    const result = await pool.query(
      'SELECT id, name, email, country FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return safe user data (excluding password)
    res.json({
      user: result.rows[0]
    });

  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


