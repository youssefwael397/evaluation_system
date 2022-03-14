// const { or } = require('sequelize/types')
const { Op } = require("sequelize");
const { User, Committee, sequelize, Sequelize } = require('../models/index')


const getAllUsers = async () => {
    const users = await User.findAll()
    return users
}

const getActiveUsers = async (name) => {
    const committee = await Committee.findOne({ where: { committee_name: name } })
    const committee_id = committee.committee_id;

    const first_active_users = await User.findAll({ where: { first_com_id: committee_id, first_com_active: true, is_admin: false } })
    const second_active_users = await User.findAll({ where: { second_com_id: committee_id, second_com_active: true, is_admin: false } })
    const active_users = [...first_active_users, ...second_active_users]
    return active_users
}

const getDisActiveUsers = async (name) => {
    const committee = await Committee.findOne({ where: { committee_name: name } })
    const committee_id = committee.committee_id;

    const first_disactive_users = await User.findAll({ where: { first_com_id: committee_id, first_com_active: false, is_admin: false } })
    const second_disactive_users = await User.findAll({ where: { second_com_id: committee_id, second_com_active: false, is_admin: false } })
    const disactive_users = [...first_disactive_users, ...second_disactive_users]
    return disactive_users
}

const getUsersByCommitteeName = async (name) => {
    const committee = await Committee.findOne({ where: { committee_name: name } })
    const committee_id = committee.committee_id;
    const users = await User.findAll({ where: { first_com_id: committee_id } })
    return users
}

const createNewUser = async (user) => {
    const committee = await Committee.findOne({ where: { committee_name: user.committee_name } })
    const first_com_id = committee.committee_id;
    const new_user = await User.create({
        user_name: user.user_name,
        email: user.email,
        password: user.password,
        facebook: user.facebook,
        gender: user.gender,
        phone: user.phone,
        image: user.image,
        faculty: user.faculty,
        university: user.university,
        first_com_id: first_com_id
    })
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
        return updated_user
    } else {
        const updated_user = await User.update(
            { second_com_active: true },
            { where: { user_id: id } }
        )
        return updated_user
    }
    return user
}

const UserRepo = {
    getAllUsers,
    getActiveUsers,
    getDisActiveUsers,
    getUsersByCommitteeName,
    createNewUser,
    createNewAdmin,
    ActivateUser
}


module.exports = { UserRepo }