import jwt from 'jsonwebtoken';
export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',//after 7 days user has to login again
    });

    // Send the token in a cookie
    // jwtToken is the name of the cookie
    res.cookie('jwtToken', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie(prevent XSS attacks)
        sameSite: 'Strict', // Helps prevent CSRF attacks
        secure: process.env.NODE_ENV === 'production', // tells if hhtp or https 
        //it will be true in production and false in development
    });

    return token;
}