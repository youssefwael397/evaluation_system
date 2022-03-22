const { TaskRepo } = require('../repos/TaskRepo')

const createNewTask = async (task) => {

    const new_task = await TaskRepo.createNewTask(task)
    console.log(new_task)
    return new_task
}

const getTasksByCommitteeName = async (name) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeName(name)
        return tasks
    } catch (error) {
        console.log('getTasksByCommitteeName error : ' + error)
    }
}

const getTasksByUserName = async (name) => {
    try {
        const tasks = await TaskRepo.getTasksByUserName(name)
        return tasks
    } catch (error) {
        console.log('getTasksByUserName error : ' + error)
    }
}

const InsertValue = async ({ users, value, task }) => {
    const new_users_task = await TaskRepo.InsertValue(users, value, task)
    console.log(users)

    return new_users_task
}

const TaskController = {
    createNewTask,
    getTasksByCommitteeName,
    getTasksByUserName,
    InsertValue
}

module.exports = { TaskController }