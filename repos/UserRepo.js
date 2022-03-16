const { User, Committee, Sequelize } = require('../models/index')
const fsAsync = require('fs').promises;
const fs = require('fs');
const bcrypt = require('bcryptjs')
const haram_encrypt = require('../env')
const jwt = require('jsonwebtoken');
const op = Sequelize.Op;
const getAllUsers = async () => {
    const users = await User.findAll()
    const promises=[];
    users.forEach((user,index) => {
        promises.push( new Promise(async(resolve, reject)=>{ 
            const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
            user.image=img
            resolve();
    })
        )
    })
    await Promise.all(promises);
    return users
}



const getUserById = async (id) => {
    const promises = [];
    const users=await User.findOne({
        where: {user_id: id } 
        },
    )
    users.forEach((user) => {
        promises.push(new Promise(async(resolve, reject)=>{
        const image = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' })
        user.image = image
        resolve();
    }))
    })
    await Promise.all(promises);
    return users
}



const getActiveUsers = async (name) => {
    const promises = [];
    const committee = await Committee.findOne({
        where: { committee_name: name } })
    const committee_id = committee.committee_id;

    const active_users = await User.findAll({ 
        where: {
        
            [op.or]:[
                {"$first_com.committee_id$":id ,first_com_active: true, is_admin: false},
                {"$second_com.committee_id$":id ,second_com_active: true, is_admin: false},
            ]
    },
        include:[{
            model:Committee,
            as:'first_com'
        },
        {
            model:Committee,
            as:'second_com'
        }
    ]
    })

        active_users.forEach((user,index) => {
            promises.push( new Promise(async(resolve, reject)=>{ 
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image=img
                resolve();
        })
            )
        })
        await Promise.all(promises);
        return active_users
    }

const getDisActiveUsers = async (name) => {
    const promises = [];

    const committee = await Committee.findOne({
        where: { committee_name: name } })
    const committee_id = committee.committee_id;

    const disactive_users = await User.findAll({ 
        where: {
        
            [op.or]:[
                {"$first_com.committee_id$":id ,first_com_active: false, is_admin: false},
                {"$second_com.committee_id$":id ,second_com_active: false, is_admin: false},
            ]
            
    },
        include:[{
            model:Committee,
            as:'first_com'
        },
        {
            model:Committee,
            as:'second_com'
        }
    ]
    })

        disactive_users.forEach((user,index) => {
            promises.push( new Promise(async(resolve, reject)=>{ 
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image=img
                resolve();
        })
            )
        })
        await Promise.all(promises);
        return disactive_users
    }


const getUsersByCommitteeName = async (name) => {
    const promises = [];
    const users=await User.findAll({
        where:{
            [op.or]:[
                {"$first_com.committee_name$":name},
                {"$second_com.committee_name$":name}

            ]
        },
        include:[{
            model:Committee,
            as:'first_com'
        },
        {
            model:Committee,
            as:'second_com'
        }
    ]
    })
    //console.log(usersTest)
    users.forEach((user) => {
        promises.push(new Promise(async(resolve, reject)=>{
        const image = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' })
        user.image = image
        resolve();
    }))
    })
    await Promise.all(promises);
    return users
}




/////////////////////////////////////////////////////////////////////////
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
        promises.push(new Promise(async(resolve, reject)=>{
        const image = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' })
        user.image = image
        resolve();
    }))
    })
    await Promise.all(promises);
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
        promises.push(new Promise(async(resolve, reject)=>{
        const image = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' })
        user.image = image
        resolve();
    }))
    })
    await Promise.all(promises);
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

