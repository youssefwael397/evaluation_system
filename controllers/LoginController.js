const { LoginRepo } = require('../repos/LoginRepo')
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env');

const login = async (login_user) => {
    const login_token = await LoginRepo.login(login_user);
    return login_token
}

// if (!username || typeof username !== 'string') {
//     return res.send({ status: 'error', error: 'Invalid Username' })
// }

// if (!user.password || typeof user.password !== 'string') {
//     return res.send({ status: 'error', error: 'Invalid Password' })
// }

const LoginController = {
    login
}

module.exports = { LoginController }