let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = 8080;



//parse application/json and look for raw text                                        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get("/api", (req, res) => res.json({ message: "Welcome to our Bookstore!" }));

app.listen(port);

module.exports = app;