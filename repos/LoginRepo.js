const { User, Committee, sequelize, Sequelize } = require('../models/index')
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env')
const jwt = require('jsonwebtoken')


const login = async (login_user) => {

    const user = await User.findOne({ where: { email: login_user.email } })

    if (await bcrypt.compare(login_user.password, user.password)) {

        if (user.first_com_active) {

            const login_token = jwt.sign({
                is_admin: true,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // one day expiration
            }, haram_encrypt)

            return login_token

        } else {

            const login_token = jwt.sign({
                is_admin: false,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // one day expiration
            }, haram_encrypt)

            return login_token
        }
    } else {

        console.log('password is false')
    }
}


const LoginRepo = {
    login
}

module.exports = { LoginRepo }