const jwt = require("jsonwebtoken")
const secret = "Animesh@@#@#@$#$$#$%"

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        }, secret
    );
}

function getUser(token) {
    if (!token) {
        console.error("JWT ERROR: No token provided!");
        return null;
    }
    
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        console.error("JWT Verification Failed:", err.message);
        return null;
    }
}


module.exports = {
    setUser,
    getUser
}