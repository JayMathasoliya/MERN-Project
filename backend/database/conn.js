const { default: mongoose } = require("mongoose");

const connect = async () => {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected Successfully")
    return db;
}

module.exports = connect;

