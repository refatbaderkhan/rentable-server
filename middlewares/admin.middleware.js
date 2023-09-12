const jwt = require("jsonwebtoken");


const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).send({message: "Unauthorized"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        if(decoded.user_type !== 0) return res.status(401).send({message: "Unauthorized"})
        next()
    } catch (error) {
        console.log(error);
        res.status(401).send({message: "Unauthorized"})
    }
}


module.exports=adminMiddleware;