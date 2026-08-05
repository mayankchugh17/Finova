const app = require("./src/app");
const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT || 8080, ()=>{
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});