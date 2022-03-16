const { UserRepo } = require('../repos/UserRepo')
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env');

const getAllUsers = async () => {
    try {
        const users = await UserRepo.getAllUsers()
        return users
    } catch (error) {
        console.log('getAllUsers error : ' + error)
    }
}

const getUserById = async (id) => {
    const user = await UserRepo.getUserById(id);
    return user;
}

const getActiveUsers = async (name) => {
    try {
        const active_users = await UserRepo.getActiveUsers(name)
        return active_users
    } catch (error) {
        console.log('getActiveUsers error : ' + error)
    }
}

const getDisActiveUsers = async (name) => {
    try {
        const disactive_users = await UserRepo.getDisActiveUsers(name)
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

const createNewUser = async (user) => {
    const password_hashed = await bcrypt.hash(user.password, 10);
    const NEW_USER = { ...user, password: password_hashed }

    try {
        const new_user = await UserRepo.createNewUser(NEW_USER);
        console.log(new_user)
        return new_user
    } catch (error) {
        console.log('createNewUser error : ' + error)
    }
    console.log(USER)
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

const ActivateUser = async (id) => {
    const updated_user = await UserRepo.ActivateUser(id);
    return updated_user
}

const UpdateImage = async (user_id, image) => {
    const updated_user = await UserRepo.UpdateImage(user_id, image);
    return updated_user
}

const login = async (login_user) => {
    const login_token = await UserRepo.login(login_user);
    return login_token
}



const UserController = {
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

module.exports = { UserController }