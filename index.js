const express = require("express");
const { connectMongoDB } = require("./connection");
const URL = require('./models/url');
const path = require('path');
const cookieParser = require('cookie-parser');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth')

const staticRouter = require('./routes/staticRouter');
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

connectMongoDB("mongodb://127.0.0.1:27017/url-shortner").then(() => console.log("MongoDB connected!"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRouter);

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}`));