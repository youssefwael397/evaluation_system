const { User, Task, Committee, sequelize, Sequelize, User_Task } = require('../models/index')


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
    const committee = await Committee.findOne({ where: { committee_name: name } })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({ where: { committee_id: committee_id } });
    return tasks
}

const getTasksByUserName = async (name) => {
    const user = await User.findOne({ where: { user_name: name } })
    const user_id = user.user_id;
    const tasks = await User_Task.findAll({ where: { user_id: user_id } });
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

const TaskRepo = {
    createNewTask,
    getTasksByCommitteeName,
    getTasksByUserName,
    InsertValue
}

module.exports = { TaskRepo }