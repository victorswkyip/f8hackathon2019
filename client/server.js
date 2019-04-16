const
    path = require('path'),
    proxy = require('express-http-proxy'),
    dotenv = require('dotenv').config({path: `${__dirname}/.env`});

const
    express = require('express'),
    //const bodyParser = require('body-parser');
    //const twilio = require('twilio');

    app = express(),
    port = process.env.PORT;

// Server all files in this directory
app.use('/', express.static(path.join(__dirname, `/`)));

app.use('/game', proxy(process.env.SESSION_SERVER_URL));

app.listen(port, () => console.log(`App server up on ${port}!`));