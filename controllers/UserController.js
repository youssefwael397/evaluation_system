const { UserRepo } = require('../repos/UserRepo')
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env')
const fsAsync = require('fs').promises;
const jwt = require('jsonwebtoken');



// get all members of spe
const getAllUsers = async () => {
    try {
        const users = await UserRepo.getAllUsers()


        return users
    } catch (error) {
        console.log('getAllUsers error : ' + error)
    }
}

// get members by id
const getUserById = async (id) => {
    const user = await UserRepo.getUserById(id);


    return user;
}


const getAllActiveUsers = async () => {
    try {
        const active_users = await UserRepo.getAllActiveUsers()

        return active_users
    } catch (error) {
        console.log('getActiveUsers error : ' + error)
    }
}

const getAllDisActiveUsers = async () => {
    try {
        const disactive_users = await UserRepo.getAllDisActiveUsers();

        return disactive_users;
    } catch (error) {
        console.log('getActiveUsers error : ' + error)
    }
}

// get active members by committee id
const getActiveUsersByCommitteeId = async (id) => {
    try {
        const active_users = await UserRepo.getActiveUsersByCommitteeId(id)

        return active_users
    } catch (error) {
        console.log('getActiveUsers error : ' + error)
    }
}

const getDisActiveUsersByCommitteeId = async (id) => {
    try {
        const disactive_users = await UserRepo.getDisActiveUsersByCommitteeId(id)

        return disactive_users
    } catch (error) {
        console.log('getDisActiveUsers error : ' + error)
    }
}

const getUsersByCommitteeName = async (name) => {
    try {
        const users = await UserRepo.getUsersByCommitteeName(name)
        return users
    } catch (error) {
        console.log('getUsersByCommitteeName error : ' + error)
    }
}

const getLeaderBoard = async (name, month) => {
    console.log("bsmellah")
    const users = await UserRepo.getLeaderBoard(name, month);

    return users;
}

const createNewUser = async (user) => {
    const password_hashed = await bcrypt.hash(user.password, 10);
    const NEW_USER = { ...user, password: password_hashed }

    try {
        const new_user = await UserRepo.createNewUser(NEW_USER);
        console.log("new user")
        console.log(new_user)
        return new_user
    } catch (error) {
        console.log('createNewUser error : ' + error)
    }
}

const createNewAdmin = async (admin) => {
    const password_hashed = await bcrypt.hash(admin.password, 10);
    const NEW_USER = {
        user_name: admin.user_name,
        email: admin.email,
        password: password_hashed,
        facebook: admin.facebook,
        gender: admin.gender,
        phone: admin.phone,
        image: admin.image,
        faculty: admin.faculty,
        university: admin.university,
        committee_name: admin.committee_name,
        is_admin: admin.is_admin,
        first_com_active: admin.active
    }

    try {
        const new_user = await UserRepo.createNewUser(NEW_USER);
        // console.log(new_user)
        return new_user

    } catch (error) {
        console.log('createNewUser error : ' + error)
    }
    console.log(USER)
}

const ActivateUser = async (user_id, committee_id) => {
    const updated_user = await UserRepo.ActivateUser(user_id, committee_id);


    return updated_user
}

const DisActivateUser = async (user_id, committee_id) => {
    const disactive_user = await UserRepo.DisActivateUser(user_id, committee_id);
    return disactive_user
}

const UpdateImage = async (user_id, image) => {
    const updated_user = await UserRepo.UpdateImage(user_id, image);

    return updated_user
}

const login = async (login_user) => {
    const login_token = await UserRepo.login(login_user);
    return login_token
}

const EditUserById = async (user) => {
    const edited_user = await UserRepo.EditUserById(user.user_id, user.user_name, user.spe_id, user.email, user.phone, user.facebook)
    return edited_user
}

const addSecondCommittee = async ({ user_id, committee }) => {
    const edited_user = await UserRepo.addSecondCommittee(user_id, committee)
    return edited_user
}

const createResetPasswordLink = async (email) => {
    const user = await UserRepo.isEmailExists(email);
    if (!user) {
        return false
        console.log("user is not exist")
    } else {
        const secret = haram_encrypt + user.password
        const payload = {
            email: user.email,
            id: user.user_id
        }
        const token = jwt.sign(payload, secret, { expiresIn: '15m' })
        const link = `https://youssefwael397.github.io/spe-evaluation-system/resetpassword/${user.user_id}/${token}`
        console.log(link)
        return link
    }
}

const resetPassword = async (id, token, password) => {
    const user = await UserRepo.isUserExists(id);
    if (!user) {
        return false
        console.log("user is not exist")
    } else {
        console.log("user is exists by id")
        console.log(user)
        const secret = haram_encrypt + user.password
        const isValid = jwt.verify(token, secret)
        if (!isValid) {
            return false
        } else {
            console.log("validate jwt")
            const newPassword = await bcrypt.hash(password, 10);
            const updated_user = await UserRepo.updatePassword(user.user_id, newPassword)
            if (updated_user) {
                console.log("updated user")
                console.log(updated_user)
                return true
            } else {
                return false
            }
        }
    }
}


const UserController = {
    getAllUsers,
    getUserById,
    getAllActiveUsers,
    getAllDisActiveUsers,
    getActiveUsersByCommitteeId,
    getDisActiveUsersByCommitteeId,
    getUsersByCommitteeName,
    getLeaderBoard,
    createNewUser,
    createNewAdmin,
    ActivateUser,
    UpdateImage,
    DisActivateUser,
    EditUserById,
    addSecondCommittee,
    login,
    createResetPasswordLink,
    resetPassword
}

module.exports = { UserController }
