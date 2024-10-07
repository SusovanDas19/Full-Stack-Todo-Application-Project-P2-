require('dotenv').config()
const express = require("express");
const app = express();
const path = require('path'); 
app.use(express.static(path.join(__dirname, 'public')));


const { mainRouter } = require("./routes/main");
const mongoose = require('mongoose');

app.use(express.json());
app.use("/api/v1/main",mainRouter);

async function main(){
    await mongoose.connect(process.env.MONGODB_URL);
    app.listen(3000,'0.0.0.0');
    console.log("Listening on port 3000");
}

main();

