const { UserRepo } = require('../repos/UserRepo')
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env');
const fsAsync = require('fs').promises;


// get all members of spe
const getAllUsers = async () => {
    try {
        const users = await UserRepo.getAllUsers()
        const promises = [];
        users.forEach((user, index) => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image = img
                resolve();
            })
            )
        })
        await Promise.all(promises);
        return users
    } catch (error) {
        console.log('getAllUsers error : ' + error)
    }
}

// get members by id
const getUserById = async (id) => {
    const user = await UserRepo.getUserById(id);
    const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' })
    user.image = img
    return user;
}


const getAllActiveUsers = async () => {
    try {
        const active_users = await UserRepo.getAllActiveUsers()
        const promises = [];
        active_users.forEach((user, index) => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image = img
                resolve();
            })
            )
        })
        await Promise.all(promises);
        return active_users
    } catch (error) {
        console.log('getActiveUsers error : ' + error)
    }
}

const getAllDisActiveUsers = async () => {
    try {
        const disactive_users = await UserRepo.getAllDisActiveUsers();
        const promises = [];
        disactive_users.forEach((user, index) => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image = img
                resolve();
            })
            )
        })
        await Promise.all(promises);
        return disactive_users;
    } catch (error) {
        console.log('getActiveUsers error : ' + error)
    }
}

// get active members by committee id
const getActiveUsersByCommitteeId = async (id) => {
    try {
        const active_users = await UserRepo.getActiveUsersByCommitteeId(id)
        const promises = [];
        active_users.forEach((user, index) => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image = img
                resolve();
            })
            )
        })
        await Promise.all(promises);
        return active_users
    } catch (error) {
        console.log('getActiveUsers error : ' + error)
    }
}

const getDisActiveUsersByCommitteeId = async (id) => {
    try {
        const disactive_users = await UserRepo.getDisActiveUsersByCommitteeId(id)
        const promises = [];
        disactive_users.forEach((user, index) => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image = img
                resolve();
            })
            )
        })
        await Promise.all(promises);
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

const ActivateUser = async (user_id, committee_id) => {
    const updated_user = await UserRepo.ActivateUser(user_id, committee_id);
    const img = await fsAsync.readFile(`images${updated_user.image}`, { encoding: 'base64' })
    updated_user.image = img
    return updated_user
}

const DisActivateUser = async (user_id, committee_id) => {
    const disactive_user = await UserRepo.DisActivateUser(user_id, committee_id);
    const img = await fsAsync.readFile(`images${disactive_user.image}`, { encoding: 'base64' })
    disactive_user.image = img
    return disactive_user
}

const UpdateImage = async (user_id, image) => {
    const updated_user = await UserRepo.UpdateImage(user_id, image);
    const img = await fsAsync.readFile(`images${updated_user.image}`, { encoding: 'base64' })
    updated_user.image = img
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


const UserController = {
    getAllUsers,
    getUserById,
    getAllActiveUsers,
    getAllDisActiveUsers,
    getActiveUsersByCommitteeId,
    getDisActiveUsersByCommitteeId,
    getUsersByCommitteeName,
    createNewUser,
    createNewAdmin,
    ActivateUser,
    UpdateImage,
    DisActivateUser,
    EditUserById,
    addSecondCommittee,
    login
}

module.exports = { UserController }