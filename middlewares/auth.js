const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try{
        const token = req.header("x-auth-token");
        if (!token)
            return res.status(401).json({msg: "No token, authorization denied"});

        const verified = jwt.verify(token, "passwordKey");
        if (!verified)
            return res.status(401).json({msg: "Token Verification Failed, authorization denied"});
        
        req.user = verified.id;
        req.token = token;
        next();
    }catch(e){
        res.status(500).json({error: err.message});
    }
};

module.exports = auth;