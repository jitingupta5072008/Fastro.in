import jwt from "jsonwebtoken";

const isAuthenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'please login',success: false });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({message: "please login"});
        }
        req.user = user.userId;
        console.log(req.user);
        next();
    });
};
export default isAuthenticate;