const { User, Committee, Sequelize } = require('../models/index')
const fs = require('fs');
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env')
const jwt = require('jsonwebtoken');
const op = Sequelize.Op;

// get all members that are not admins
const getAllUsers = async () => {
    const users = await User.findAll({ where: { is_admin: false } })
    return users
}

// get member by id
const getUserById = async (id) => {
    const user = await User.findOne({
        where: {
            user_id: id,
        },
    })

    return user
}

// get all active members
const getAllActiveUsers = async () => {
    const active_users = await User.findAll({
        where: {
            [op.or]: [
                { first_com_id: { [op.not]: null }, first_com_active: 1, is_admin: false },
                { second_com_id: { [op.not]: null }, second_com_active: 1, is_admin: false },
            ]
        },
    })
    return active_users
}

// get all disactive members
const getAllDisActiveUsers = async () => {
    const disactive_users = await User.findAll({
        where: {
            [op.or]: [
                { first_com_id: { [op.not]: null }, first_com_active: 0, is_admin: false },
                { second_com_id: { [op.not]: null }, second_com_active: 0, is_admin: false },
            ]
        }
    })
    return disactive_users
}

// get active members in special committee by committee id
const getActiveUsersByCommitteeId = async (id) => {


    const active_users = await User.findAll({
        where: {
            [op.or]: [
                { first_com_id: id, first_com_active: true, is_admin: false },
                { second_com_id: id, second_com_active: true, is_admin: false }, // "$second_com.committee_id$": id 
            ]
        },
    })
    return active_users
}

// get disactive members in special committee by committee id
const getDisActiveUsersByCommitteeId = async (id) => {
    const disactive_users = await User.findAll({
        where: {
            [op.or]: [
                { first_com_id: id, first_com_active: 0, is_admin: false },
                { second_com_id: id, second_com_active: 0, is_admin: false },
            ]
        },
    })

    return disactive_users
}


const getUsersByCommitteeName = async (name) => {
    const promises = [];
    const users = await User.findAll({
        where: {
            [op.or]: [
                { "$first_com.committee_name$": name },
                { "$second_com.committee_name$": name }
            ]
        },
        include: [{
            model: Committee,
            as: 'first_com'
        },
        {
            model: Committee,
            as: 'second_com'
        }
        ]
    })
    //console.log(usersTest)
    users.forEach((user) => {
        promises.push(new Promise(async (resolve, reject) => {
            const image = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' })
            user.image = image
            resolve();
        }))
    })
    await Promise.all(promises);
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

const ActivateUser = async (id, committee_id) => {
    const user = await User.findOne(
        { where: { user_id: id, is_admin: false } }
    );

    if (user.first_com_id == committee_id) {
        await User.update(
            { first_com_active: true },
            { where: { user_id: id } }
        )
    } else if (user.second_com_id == committee_id) {
        await User.update(
            { second_com_active: true },
            { where: { user_id: id } }
        )
    }

    const updated_user = await User.findOne(
        { where: { user_id: id } }
    );

    return updated_user
}

const DisActivateUser = async (id, committee_id) => {
    const user = await User.findOne(
        { where: { user_id: id, is_admin: false } }
    );

    if (user.first_com_id == committee_id) {
        await User.update(
            { first_com_active: false },
            { where: { user_id: id } }
        )
    } else if (user.second_com_id == committee_id) {
        await User.update(
            { second_com_active: false },
            { where: { user_id: id } }
        )
    }

    const disactive_user = await User.findOne(
        { where: { user_id: id } }
    );

    return disactive_user
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

const EditUserById = async (user_id, email, phone, facebook) => {

    await User.update(
        { email: email, phone: phone, facebook: facebook },
        { where: { user_id: user_id } }
    )
    const edited_user = await User.findOne({ where: { user_id: user_id } })
    return edited_user
}

const addSecondCommittee = async (user_id, committee_id) => {

    await User.update(
        { second_com_id: committee_id },
        { where: { user_id: user_id } }
    )
    const edited_user = await User.findOne({ where: { user_id: user_id } })
    return edited_user
}

const UserRepo = {
    getAllUsers,
    getActiveUsersByCommitteeId,
    getAllActiveUsers,
    getAllDisActiveUsers,
    getDisActiveUsersByCommitteeId,
    getUsersByCommitteeName,
    createNewUser,
    createNewAdmin,
    ActivateUser,
    DisActivateUser,
    UpdateImage,
    getUserById,
    EditUserById,
    addSecondCommittee,
    login
}


module.exports = { UserRepo }