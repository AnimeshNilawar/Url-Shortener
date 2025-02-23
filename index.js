const express = require("express");
const { connectMongoDB } = require("./connection");
const URL = require('./models/url');
const path = require('path');
const staticRouter = require('./routes/staticRouter')
const urlRoute = require("./routes/url")

const app = express();
const PORT = 8001;

connectMongoDB("mongodb://127.0.0.1:27017/url-shortner").then(() => console.log("MongoDB connected!"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRouter);

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