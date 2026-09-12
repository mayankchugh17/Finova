const Accounts = require("../models/accounts.model.js");
  
async function createAccountController(req, res){
    try{
        const user = req.user;
        const account = await Accounts.create({
            user:user._id,
        })
        
        res.status(201).json({account})
    }
    catch(error)
    {
        console.error("Account Controller Error: ", error)
    }
};

module.exports = createAccountController;