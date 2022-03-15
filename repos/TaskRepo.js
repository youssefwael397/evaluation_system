const { User, Task, Committee, sequelize, Sequelize } = require('../models/index')


const createNewTask = async (task) => {
    const new_task = await Task.create({
        task_name: task.task_name,
        task_value: task.task_value,
        type: task.type,
        committee_id: task.committee_id
    })
    return new_task
    console.log(new_task)
}

const TaskRepo = {
    createNewTask
}

module.exports = {TaskRepo}