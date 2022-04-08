const { User, Committee, Task, Sequelize, sequelize } = require('../models/index')
const fs = require('fs');
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env')
const jwt = require('jsonwebtoken');
const user_task = require('../models/user_task');
const op = Sequelize.Op;
const attrs = ["user_id", "spe_id", "user_name", "email", "facebook", "phone", "image", "first_com_id", "second_com_id", "first_com_active", "second_com_active", "faculty", "university", "createdAt", "updatedAt"]


// get all members that are not admins
const getAllUsers = async () => {
    const users = await User.findAll({ where: { is_admin: false }, attributes: attrs })
    return users
}


const getLeaderBoard = async (committee_name, month) => {
    const committee = await Committee.findOne({ where: { committee_name: committee_name } })
    const committee_id = committee.committee_id;
    console.log("bsm ellah")
    const users = await sequelize.query(`
    SELECT COALESCE(sum(User_Tasks.value),0) as user_grades,
    COALESCE(sum(tasks.task_value),0) as task_grades,
    Tasks.type, Users.user_name, Users.image 
    from User_Tasks 
    LEFT join Tasks 
    on Tasks.task_id = User_Tasks.task_id 
    RIGHT JOIN Users 
    ON Users.user_id = User_Tasks.user_id
    WHERE users.is_admin = false 
    AND tasks.committee_id = ${committee_id}
    AND tasks.month = ${month}
    AND ( users.first_com_id = ${committee_id}
    AND first_com_active = true )
    OR (users.second_com_id = ${committee_id}
    AND second_com_active = true )
    GROUP BY Users.user_name, Tasks.type;
    `);


    const board = await users[0]
    let new_board = []

    board.map((user, index) => {
        if (index == 0) {
            new_board.push(user)
        } else {
            if (user.user_name !== new_board[new_board.length - 1].user_name) {
                new_board.push(user)
            } else {
                if (new_board[new_board.length - 1].type == 'm') {
                    new_board[new_board.length - 1] = {
                        user_name: new_board[new_board.length - 1].user_name,
                        user_meeting_grades: new_board[new_board.length - 1].user_grades,
                        meeting_grades: new_board[new_board.length - 1].task_grades,
                        user_task_grades: user.user_grades,
                        task_grades: user.task_grades,
                        image: user.image
                    }
                } else {
                    new_board[new_board.length - 1] = {
                        user_name: new_board[new_board.length - 1].user_name,
                        user_meeting_grades: user.user_grades,
                        meeting_grades: user.task_grades,
                        user_task_grades: new_board[new_board.length - 1].user_grades,
                        task_grades: new_board[new_board.length - 1].task_grades,
                        image: user.image
                    }
                }
            }
        }
    })


    return new_board;
}


// get member by id
const getUserById = async (id) => {
    const current_user = await User.findOne({
        attributes: attrs,
        where: {
            user_id: id,
        },
    })

    return current_user
}

// get all active members
const getAllActiveUsers = async () => {
    const active_users = await User.findAll({
        attributes: attrs,
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
        attributes: attrs,
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
        attributes: attrs,
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
        attributes: attrs,
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
        attributes: attrs,
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
    users.forEach((user) => {
        promises.push(new Promise(async (resolve, reject) => {
            const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' })
            user.image = img
            resolve();
        }))
    })
    await Promise.all(promises);
    return users
}


const createNewUser = async (user) => {
    const exists_user = await User.findOne({
        where: {
            [op.or]: [
                { email: user.email },
                { phone: user.phone },
                { facebook: user.facebook }
            ]
        },
    })
    if (!exists_user) {
        const committee = await Committee.findOne({ where: { committee_name: user.committee_name } })
        const first_com_id = committee.committee_id;
        await User.create({
            ...user,
            first_com_id: first_com_id
        })

        const new_user = await User.findOne({ where: { email: user.email } })
        return new_user
    }

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
    const user = await User.findOne({
        attributes: attrs,
        where: { user_id: id, is_admin: false }
    });

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
        {
            attributes: attrs,
            where: { user_id: id, is_admin: false }
        }
    );

    if (user.first_com_id == committee_id) {
        await User.update(
            { first_com_id: null, first_com_active: false },
            { where: { user_id: id } }
        )

    } else if (user.second_com_id == committee_id) {
        await User.update(
            { second_com_id: null, second_com_active: false },
            { where: { user_id: id } }
        )
    }

    const disactive_user = await User.findOne(
        {
            where: { user_id: id }
        }
    );

    if (disactive_user.first_com_id === null && disactive_user.second_com_id === null) {
        await User.destroy({ where: { user_id: id } })
        console.log('destroyed success')
        return disactive_user
    }

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
        { attributes: attrs, where: { user_id: user_id } }
    );

    return updated_user
}

const login = async (login_user) => {

    const user = await User.findOne({ where: { email: login_user.email } })
    if (user) {
        if (await bcrypt.compare(login_user.password, user.password)) {

            if (user.first_com_active || user.second_com_active) {

                const first_com = await Committee.findOne({ where: { committee_id: user.first_com_id } })
                const first_com_name = first_com.committee_name

                const login_token = jwt.sign({
                    user_id: user.user_id,
                    user_name: user.user_name,
                    email: user.email,
                    facebook: user.facebook,
                    phone: user.phone,
                    spe_id: user.spe_id,
                    first_com_id: user.first_com_id,
                    is_admin: user.is_admin,
                    first_com_name,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // one week expiration
                }, haram_encrypt)

                if (user.second_com_id !== null) {

                    const second_com = await Committee.findOne({ where: { committee_id: user.second_com_id } })

                    const second_com_name = second_com.committee_name

                    const login_token = jwt.sign({
                        user_id: user.user_id,
                        user_name: user.user_name,
                        email: user.email,
                        facebook: user.facebook,
                        phone: user.phone,
                        spe_id: user.spe_id,
                        first_com_id: user.first_com_id,
                        second_com_id: user.second_com_id,
                        is_admin: user.is_admin,
                        first_com_name,
                        second_com_name,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // one day expiration
                    }, haram_encrypt)

                    return login_token
                }

                return login_token

            }
        } else {
            return false
            console.log('password is false')
        }
    }

}

const EditUserById = async (user_id, user_name, spe_id, email, phone, facebook) => {

    await User.update(
        { email: email, phone: phone, facebook: facebook, spe_id: spe_id, user_name: user_name },
        { where: { user_id: user_id } }
    )
    const edited_user = await User.findOne({ attributes: attrs, where: { user_id: user_id } })
    return edited_user
}

const addSecondCommittee = async (user_id, committee_name) => {

    const committee = await Committee.findOne({ where: { committee_name: committee_name } })

    const committee_id = committee.committee_id

    const user = await User.findOne({ attributes: attrs, where: { user_id: user_id } })
    if (user.first_com_id == null) {
        await User.update(
            { first_com_id: committee_id },
            { where: { user_id: user_id } }
        )
        const edited_user = await User.findOne({ attributes: attrs, where: { user_id: user_id } })
        return edited_user
    } else if (user.second_com_id == null) {
        await User.update(
            { second_com_id: committee_id },
            { where: { user_id: user_id } }
        )
        const edited_user = await User.findOne({
            attributes: attrs,
            where: {
                user_id: user_id,
                first_com_id: { [op.not]: null },
                second_com_id: { [op.not]: null }
            }
        })
        return edited_user
    }
}

const UserRepo = {
    getAllUsers,
    getActiveUsersByCommitteeId,
    getAllActiveUsers,
    getAllDisActiveUsers,
    getDisActiveUsersByCommitteeId,
    getUsersByCommitteeName,
    getLeaderBoard,
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
