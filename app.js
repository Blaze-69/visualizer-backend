if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const healthcheck = require('./routes/api');
const auth = require('./routes/auth');
const app = express();
const port = process.env.PORT || 3000;
const URI = process.env.URI || 'mongodb://localhost:27017/visualizer';

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', healthcheck);
app.use('/api', auth);

app.listen(port, () => {
    console.log('Server has started!');
});
