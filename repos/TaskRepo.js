const { User, Task, User_Task, Committee, sequelize, Sequelize } = require('../models/index')
const op = Sequelize.Op;
const attrs = ["user_id", "user_name", "email", "facebook", "phone", "image", "first_com_id", "second_com_id", "first_com_active", "second_com_active"]


const createNewTask = async (task) => {
    const new_task = await Task.create({
        task_name: task.task_name,
        task_value: task.task_value,
        type: task.type,
        committee_id: task.committee_id
    })
    return new_task
}

const getTasksByCommitteeName = async (name) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id },
        include: [{
            model: User,
            required: true,
        }],
    });
    return tasks
}

const getTasksByCommitteeNameAndUserId = async (name, user) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id },
        attributes: ["task_id", "task_name", "task_value", "type", "createdAt"],
        include: [
            {
                model: User,
                where: { user_id: user },
                attributes: ["user_name", "image"]
            }
        ]
    });

    return tasks
}

const getTasksByUserId = async (id) => {
    const tasks = await User_Task.findAll(
        {
            where: { user_id: id },
            include: [
                {
                    model: Task,
                    // attributes: []
                }
            ]
        });
    return tasks
}

const InsertValue = async (users, value, task) => {

    const new_users_task = await users.map(async (user) => {
        await User_Task.create({
            value: value,
            task_id: task,
            user_id: user.id
        })
    })

    return `task: ${task} value: ${value} 's inserted to users ids:${users.map(user => { return ` ${user.id}` })}.`
}


const getUsersTasksByCommitteeId = async (committee_id) => {
    const users = User.findAll({
        where: {
            [op.or]: [
                { first_com_id: committee_id, first_com_active: 1, is_admin: false },
                { second_com_id: committee_id, second_com_active: 1, is_admin: false },
            ]
        },

    })

    return users
}

const getTasksByCommitteeNameAndUserIdAndType = async (name, user, type) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id, type: type },
        attributes: ["task_id", "task_name", "task_value", "type", "createdAt"],
        include: [
            {
                model: User,
                where: { user_id: user },
                attributes: ["user_name", "image"]
            }
        ]
    });
    return tasks
}

const TaskRepo = {
    createNewTask,
    getTasksByCommitteeName,
    getTasksByUserId,
    InsertValue,
    getUsersTasksByCommitteeId,
    getTasksByCommitteeNameAndUserId,
    getTasksByCommitteeNameAndUserIdAndType
}

module.exports = { TaskRepo }