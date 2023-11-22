// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Procurement Tracker Backend'));

app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});
