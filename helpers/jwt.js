const { expressjwt: expressJwt } = require("express-jwt");
require('dotenv/config');
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;

    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })

}

async function isRevoked(req, payload, done) {
    try {
        // Your existing logic for revoking tokens

        if (!payload.isAdmin) {
            done(null, true);
        }

        done();
    } catch (error) {
        console.error("Error in isRevoked:", error);
        done(error, true);
    }
}



module.exports = authJwt 
