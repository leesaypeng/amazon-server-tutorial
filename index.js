const express = require("express");
const mongoose = require("mongoose");

const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");


// middleware
// CLIENT --> MIDDLEWARE --> SERVER --> CLIENT
// init
const PORT = 3000;
const app = express();
const DB = "mongodb+srv://godpeng98:uQKe5ezOZhScCvNZ@cluster0.kxqg4vq.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

// connection
mongoose.
    connect(DB).
    then(() => {
    console.log("Connection Successful");
}).catch(e => {
    console.log(e); 
}) 

// GET POST PUT DELETE UPDATE --> CRUD
app.listen(PORT, "0.0.0.0", () =>{
    console.log(`connected at port ${PORT}`);
});