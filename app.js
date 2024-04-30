const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./src/routes/routes');
dotenv.config();


const app = express();

var corsOptions =  {
    origin: 'http://localhost:3000'
}

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.use(cors(corsOptions));

// Simple routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to IgeniaLabs API." });
  });

// Routes
app.use("/api/v1",router);

  

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000');
});
