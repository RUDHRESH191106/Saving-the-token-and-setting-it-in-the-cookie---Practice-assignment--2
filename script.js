

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

app.use(express.json());

const SECRET_KEY = 'my_secret_key';

const encrypt = (payload, secret) => {
 
  const token = jwt.sign(payload, secret, { expiresIn: '60s' });
  return token;
};


app.post('/generate-token', (req, res) => {
  const user = req.body; 
  const token = encrypt(user, SECRET_KEY);
  res.json({ token });
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token not provided' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });

    req.user = user;
    next();
  });
};


app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted!', user: req.user });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
