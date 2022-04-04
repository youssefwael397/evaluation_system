const { TaskRepo } = require('../repos/TaskRepo')
const fsAsync = require('fs').promises;

const createNewTask = async (task) => {

    const new_task = await TaskRepo.createNewTask(task)
    console.log(new_task)
    return new_task
}

const getTasksByCommitteeName = async (name) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeName(name)
        const promises = [];
        tasks.forEach(async (task, index) => {
            await task.Users.forEach(async user => {
                promises.push(new Promise(async (resolve, reject) => {
                    const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                    user.image = img
                    resolve();
                }))
            });
        })
        await Promise.all(promises);
        return tasks
    } catch (error) {
        console.log('getTasksByCommitteeName error : ' + error)
    }
}

const getTasksByCommitteeNameAndUserId = async (committee, user) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeNameAndUserId(committee, user)
        const promises = [];
        tasks.forEach(async (task, index) => {
            await task.Users.forEach(async user => {
                promises.push(new Promise(async (resolve, reject) => {
                    const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                    user.image = img
                    resolve();
                }))
            });
        })
        await Promise.all(promises);
        return tasks
    } catch (error) {
        console.log('getTasksByCommitteeNameAndUserId error : ' + error)
    }
}

const getTasksByCommitteeNameAndUserIdAndMonth = async (committee, user, month) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeNameAndUserIdAndMonth(committee, user, month)
        return tasks
    } catch (error) {
        console.log('getTasksByCommitteeNameAndUserIdAndMonth error : ' + error)
    }
}

const getTasksByCommitteeNameAndType = async (committee, type) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeNameAndType(committee, type)
        const promises = [];
        tasks.forEach(async (task, index) => {
            await task.Users.forEach(async user => {
                promises.push(new Promise(async (resolve, reject) => {
                    const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                    user.image = img
                    resolve();
                }))
            });
        })
        await Promise.all(promises);
        return tasks
    } catch (error) {
        console.log('getTasksByCommitteeNameAndUserIdAndType error : ' + error)
    }
}

const getTasksByCommitteeNameAndUserIdAndType = async (committee, user, type) => {
    try {
        const tasks = await TaskRepo.getTasksByCommitteeNameAndUserIdAndType(committee, user, type)
        const promises = [];
        tasks.forEach(async (task, index) => {
            await task.Users.forEach(async user => {
                promises.push(new Promise(async (resolve, reject) => {
                    const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                    user.image = img
                    resolve();
                }))
            });
        })
        await Promise.all(promises);
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


const getUsersByTaskId = async (id) => {
    try {
        const task = await TaskRepo.getUsersByTaskId(id)
        return task
    } catch (error) {
        console.log('getUsersByTaskId error : ' + error)
    }
}

const getTaskUsers = async (id) => {
    try {
        const task = await TaskRepo.getTaskUsers(id)
        console.log(task)
        // if (task.Users) {
        //     const promises = [];
        //     await task.Users.forEach(async user => {
        //         promises.push(new Promise(async (resolve, reject) => {
        //             const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
        //             user.image = img
        //             resolve();
        //         }))
        //     });
        //     await Promise.all(promises);
        // }

        return task
    } catch (error) {
        console.log('getUsersByTaskId error : ' + error)
    }
}

const InsertValue = async ({ users, value, task }) => {
    console.log(users)
    const new_users_task = await TaskRepo.InsertValue(users, value, task)
    return new_users_task
}

const getUsersTasksByCommitteeId = async (committee_id) => {
    const users = await TaskRepo.getUsersTasksByCommitteeId(committee_id)
    const promises = [];
    tasks.forEach(async (task, index) => {
        await task.Users.forEach(async user => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image = img
                resolve();
            }))
        });
    })
    await Promise.all(promises);
    return users
}

const getTasksByCommitteeNameAndTypeAndMonth = async (committee, type, month) => {
    const users = await TaskRepo.getTasksByCommitteeNameAndTypeAndMonth(committee, type, month)
    const promises = [];
    users.forEach(async (task, index) => {
        await task.Users.forEach(async user => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image = img
                resolve();
            }))
        });
    })
    await Promise.all(promises);
    return users
}

const getTasksByCommitteeNameAndTypeAndMonthAndUser = async (user, committee, type, month) => {
    const users = await TaskRepo.getTasksByCommitteeNameAndTypeAndMonthAndUser(user, committee, type, month)
    return users
}

const getTasksByCommitteeNameAndMonth = async (committee, month) => {
    const users = await TaskRepo.getTasksByCommitteeNameAndMonth(committee, month)
    const promises = [];
    users.forEach(async (task, index) => {
        await task.Users.forEach(async user => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`images${user.image}`, { encoding: 'base64' });
                user.image = img
                resolve();
            }))
        });
    })
    await Promise.all(promises);
    return users
}

const deleteUserTaskByUserIdAndTaskId = async (user, task) => {
    const user_task = await TaskRepo.deleteUserTaskByUserIdAndTaskId(user, task);
    return user_task
}

const deleteTaskById = async (id) => {
    try {
        console.log(id)
        const user_task = await TaskRepo.deleteTaskById(id);
        return user_task
    } catch (error) {
        console.log(error)
    }

}

const TaskController = {
    createNewTask,
    getTasksByCommitteeName,
    getTasksByUserId,
    InsertValue,
    getUsersTasksByCommitteeId,
    getTasksByCommitteeNameAndUserId,
    getTasksByCommitteeNameAndUserIdAndType,
    getTasksByCommitteeNameAndType,
    getTasksByCommitteeNameAndTypeAndMonth,
    getTasksByCommitteeNameAndTypeAndMonthAndUser,
    getTasksByCommitteeNameAndMonth,
    getUsersByTaskId,
    deleteUserTaskByUserIdAndTaskId,
    getTaskUsers,
    deleteTaskById,
    getTasksByCommitteeNameAndUserIdAndMonth
}

module.exports = { TaskController }