const { User, Committee } = require('../models/index')
const fs = require('fs');
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env')
const jwt = require('jsonwebtoken')

const getAllUsers = async () => {
    const users = await User.findAll()
    const promises=[];
    users.forEach((user,index) => {
        promises.push( new Promise(async(resolve, reject)=>{ 
            const img = await fs.readFile(`images${user.image}`, { encoding: 'base64' });
            user.image=img
            resolve();
    })
        )
    })
    await Promise.all(promises);
    return users
}

const getUserById = async (id) => {
    const user = await User.findOne({ where: { user_id: id } })
    const image = fs.readFileSync(`images${user.image}`, { encoding: 'base64' })
    user.image = image
    return user
}

const getActiveUsers = async (name) => {
    const committee = await Committee.findOne({ where: { committee_name: name } })
    const committee_id = committee.committee_id;

    const first_active_users = await User.findAll({ where: { first_com_id: committee_id, first_com_active: true, is_admin: false } })
    const second_active_users = await User.findAll({ where: { second_com_id: committee_id, second_com_active: true, is_admin: false } })
    const active_users = [...first_active_users, ...second_active_users];
    active_users.forEach((user) => {
        const image = fs.readFileSync(`images${user.image}`, { encoding: 'base64' })
        user.image = image
    })
    return active_users
}

const getDisActiveUsers = async (name) => {
    const committee = await Committee.findOne({ where: { committee_name: name } })
    const committee_id = committee.committee_id;

    const first_disactive_users = await User.findAll({ where: { first_com_id: committee_id, first_com_active: false, is_admin: false } })
    const second_disactive_users = await User.findAll({ where: { second_com_id: committee_id, second_com_active: false, is_admin: false } })
    const disactive_users = [...first_disactive_users, ...second_disactive_users]
    disactive_users.forEach((user) => {
        const image = fs.readFileSync(`images${user.image}`, { encoding: 'base64' })
        user.image = image
    })
    return disactive_users
}

const getUsersByCommitteeName = async (name) => {
    const committee = await Committee.findOne({ where: { committee_name: name } })
    const committee_id = committee.committee_id;
    const users = await User.findAll({ where: { first_com_id: committee_id } });
    users.forEach((user) => {
        const image = fs.readFileSync(`images${user.image}`, { encoding: 'base64' })
        user.image = image
    })
    return users
}

const createNewUser = async (user) => {
    const committee = await Committee.findOne({ where: { committee_name: user.committee_name } })
    const first_com_id = committee.committee_id;
    await User.create({
        ...user,
        first_com_id: first_com_id
    })

    const new_user = await User.findOne({ where: { user_name: user.user_name } })

    return new_user
}

const createNewAdmin = async (admin) => {
    const committee = await Committee.findOne({ where: { committee_name: admin.committee_name } })
    const first_com_id = committee.committee_id;
    try {
        const new_admin = User.create({
            user_name: admin.admin_name,
            email: admin.email,
            password: admin.password,
            facebook: admin.facebook,
            gender: admin.gender,
            phone: admin.phone,
            image: admin.image,
            faculty: admin.faculty,
            university: admin.university,
            first_com_id: first_com_id,
            is_admin: admin.is_admin,
            active: admin.active,
        })
        return new_admin;
    } catch (error) {
        console.log(error)
    }

}

const ActivateUser = async (id) => {
    const user = await User.findOne(
        { where: { user_id: id } }
    );

    if (!user.first_com_active) {
        const updated_user = await User.update(
            { first_com_active: true },
            { where: { user_id: id } }
        )
    } else {
        const updated_user = await User.update(
            { second_com_active: true },
            { where: { user_id: id } }
        )
    }

    const updated_user = await User.findOne(
        { where: { user_id: id } }
    );

    updated_user.forEach((user) => {
        const image = fs.readFileSync(`images${user.image}`, { encoding: 'base64' })
        user.image = image
    })

    return updated_user
    // return user
}

const UpdateImage = async (user_id, image) => {

    const user = await User.findOne(
        { where: { user_id: user_id } }
    );

    fs.unlinkSync(`images/${user.image}`)

    await User.update(
        { image: image },
        { where: { user_id: user_id } }
    )

    const updated_user = await User.findOne(
        { where: { user_id: user_id } }
    );

    updated_user.forEach((user) => {
        const image = fs.readFileSync(`images${user.image}`, { encoding: 'base64' })
        user.image = image
    })

    return updated_user
}

const login = async (login_user) => {

    const user = await User.findOne({ where: { email: login_user.email } })

    if (await bcrypt.compare(login_user.password, user.password)) {

        if (user.first_com_active) {

            const login_token = jwt.sign({
                user_id: user.user_id,
                user_name: user.user_name,
                email: user.email,
                first_com_id: user.first_com_id,
                second_com_id: user.second_com_id,
                is_admin: user.is_admin,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // one day expiration
            }, haram_encrypt)

            return login_token

        }
    } else {

        console.log('password is false')
    }
}


const UserRepo = {
    getAllUsers,
    getActiveUsers,
    getDisActiveUsers,
    getUsersByCommitteeName,
    createNewUser,
    createNewAdmin,
    ActivateUser,
    UpdateImage,
    getUserById,
    login
}


module.exports = { UserRepo }
