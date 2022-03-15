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
    const user = await user.findOne({ where: { user_name: name } })
    const user_id = user.user_id;
    const tasks = await User_Task.findAll({ where: { user_id: user_id } });
    return tasks
}

const InsertValue = async (user_task) => {
    console.log(user_task)
    const user = await User.findOne({ where: { user_name: user_task.user_name } })
    const user_id = user.user_id;
    const task = await Task.findOne({ where: { task_name: user_task.task_name } })
    const task_id = task.task_id;
    const new_user_task = await User_Task.create({
        value: user_task.value,
        task_id: task_id,
        user_id: user_id
    })
    return new_user_task
}

const TaskRepo = {
    createNewTask,
    getTasksByCommitteeName,
    getTasksByUserName,
    InsertValue
}

module.exports = {TaskRepo}