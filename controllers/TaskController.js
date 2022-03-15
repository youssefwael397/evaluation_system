const { TaskRepo } = require('../repos/TaskRepo')

const createNewTask = async (task) => {

    const new_task = await TaskRepo.createNewTask(task)
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

const InsertValue = async (user_task) => {
    // console.log(user_task)
    const new_user_task = await TaskRepo.InsertValue(user_task)
    return new_user_task
}

const TaskController = {
    createNewTask,
    getTasksByCommitteeName,
    getTasksByUserName,
    InsertValue
}

module.exports = {TaskController}