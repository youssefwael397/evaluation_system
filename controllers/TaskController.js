const { TaskRepo } = require('../repos/TaskRepo')

const createNewTask = async (task) => {

    const new_task = await TaskRepo.createNewTask(task)
    return new_task
}

const TaskController = {
    createNewTask
}

module.exports = {TaskController}