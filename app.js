if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const healthcheck = require('./routes/api');
const auth = require('./routes/auth');
const comment = require('./routes/comment');
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const URI = process.env.URI || 'mongodb+srv://Akash:iqNNO4NtnUOtKXHv@cluster0.iyuwe.mongodb.net/Visualizers?retryWrites=true&w=majority';

const connectWithRetry = (uris, options, maxAttempts = 5) => {
    connectWithRetry.timeout = connectWithRetry.timeout || 0;
    return mongoose.connect(uris, options, (err) => {
        if (err)
            if (connectWithRetry.timeout <= (maxAttempts - 1) * 5000) {
                console.error(
                    `Failed to connect to mongo on startup - retrying in ${(connectWithRetry.timeout += 5000) / 1000
                    } sec`,
                    connectWithRetry.previousError != "" + err
                        ? `\n${(connectWithRetry.previousError = err)}`
                        : ""
                );
                setTimeout(connectWithRetry, connectWithRetry.timeout, uris, options);
            } else process.exit(1);
        else console.log("Connected to MongoDB successfully!");
    });
};

connectWithRetry(URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*const Algorithm = require("./models/algorithm");

var arr = [{name:"Linked List"},{name:"Double Linked List"},{name:"Stack"},{name:"Queue"}];

arr.forEach(function(item){
  Algorithm.create(item,{ unique: true },function(err,algo){
  if(err){
  console.log(err);}
  else
  {console.log(algo);}
});
});*/

app.use('/api', healthcheck);
app.use('/api', auth);
app.use('/api', comment);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(422).send({ success: false, error: err.message });
});

const http = require('http').createServer(app)

http.listen(port, () => {
    console.log("Server has started!");
});

