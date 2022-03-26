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

const getTasksByCommitteeNameAndUserId = async (committee, user) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeNameAndUserId(committee, user)
        return tasks
    } catch (error) {
        console.log('getTasksByCommitteeNameAndUserId error : ' + error)
    }
}


const getTasksByCommitteeNameAndType = async (committee, type) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeNameAndType(committee, type)
        return tasks
    } catch (error) {
        console.log('getTasksByCommitteeNameAndUserIdAndType error : ' + error)
    }
}

const getTasksByCommitteeNameAndUserIdAndType = async (committee, user, type) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeNameAndUserIdAndType(committee, user, type)
        return tasks
    } catch (error) {
        console.log('getTasksByCommitteeNameAndUserIdAndType error : ' + error)
    }
}

const getTasksByUserId = async (id) => {
    try {
        const tasks = await TaskRepo.getTasksByUserId(id)
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

const getUsersTasksByCommitteeId = async (committee_id) => {
    const users = await TaskRepo.getUsersTasksByCommitteeId(committee_id)
    return users
}

const TaskController = {
    createNewTask,
    getTasksByCommitteeName,
    getTasksByUserId,
    InsertValue,
    getUsersTasksByCommitteeId,
    getTasksByCommitteeNameAndUserId,
    getTasksByCommitteeNameAndUserIdAndType,
    getTasksByCommitteeNameAndType
}

module.exports = { TaskController }