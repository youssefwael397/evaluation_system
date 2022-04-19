const { User, Task, User_Task, Committee, sequelize, Sequelize } = require('../models/index')
const op = Sequelize.Op;

const attrs = ["user_id", "spe_id", "user_name", "email", "facebook", "phone", "image", "first_com_id", "second_com_id", "first_com_active", "second_com_active", "faculty", "university", "createdAt", "updatedAt"]


const createNewTask = async (task) => {
    const new_task = await Task.create({
        task_name: task.task_name,
        task_value: task.task_value,
        type: task.type,
        committee_id: task.committee_id,
        month: task.month
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

const getTasksByCommitteeNameAndUserIdAndMonth = async (name, user, month) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id, month: month },
        include: [
            {
                model: User,
                where: { user_id: user },
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
                }
            ]
        });
    return tasks
}

const getUsersByTaskId = async (id) => {

    const task = await Task.findOne(
        {
            where: { task_id: id },
        });

    const tasks = await Task.findOne(
        {
            where: { task_id: id },

        });
    return tasks
}


const getTaskUsers = async (id) => {

    const task = await Task.findOne(
        {
            where: { task_id: id },
        });

    const tasks = await Task.findOne(
        {
            where: { task_id: id },
            include: [
                {
                    model: User,
                    where: {
                        [op.or]: [
                            { first_com_id: task.committee_id, first_com_active: 1, is_admin: false },
                            { second_com_id: task.committee_id, second_com_active: 1, is_admin: false },
                        ]
                    }
                }
            ]
        });
    return tasks
}


const InsertValue = async (users, value, task) => {

    console.log('task repo')
    console.log(users)
    console.log(value)
    console.log(task)
    try {
        const new_users_task = await users.forEach((async (user) => {

            console.log(user.name)
            const current_user = await User.findOne({ where: { user_name: user.name } })
            const user_task = await User_Task.findOne({ where: { task_id: task, user_id: current_user.user_id } })
            if (!user_task) {
                await User_Task.create({
                    value: value,
                    task_id: task,
                    user_id: current_user.user_id
                })
            } else {
                await User_Task.update(
                    {
                        value: value,
                        task_id: task,
                    },
                    {
                        where: {
                            user_id: current_user.user_id
                        }
                    })
            }

        }))
        return `task: ${task} with value: ${value} 's inserted to: ${users.map(user => { return ` ${user.name}` })}.`

    } catch (error) {
        console.log('error in task repo')
    }

}


const getUsersTasksByCommitteeId = async (committee_id) => {
    const users = User.findAll({
        where: {
            [op.or]: [
                { first_com_id: committee_id, first_com_active: 1, is_admin: false },
                { second_com_id: committee_id, second_com_active: 1, is_admin: false },
            ]
        },
        include: [
            {
                model: User,
                where: { user_id: user },
                attributes: ["user_name", "image"]
            }
        ]

    })

    return users
}


const getTasksByCommitteeNameAndType = async (name, type) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id, type: type },
        include: [
            {
                model: User,
                attributes: ["user_name", "image"]
            }
        ]
    });
    return tasks
}

const getTasksByCommitteeNameAndUserIdAndType = async (name, user, type) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id, type: type },
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

const getTasksByCommitteeNameAndTypeAndMonth = async (name, type, month) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id, type: type, month: month },
        include: [
            {
                model: User,
                attributes: ["user_name", "image"]
            }
        ]
    });
    return tasks
}

const getTasksByCommitteeNameAndTypeAndMonthAndUser = async (user, name, type, month) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id, type: type, month: month },
        include: [
            {
                model: User,
                attributes: ["user_name", "image"],
                where: {
                    user_id: user
                }
            }
        ]
    });
    return tasks
}

const getTasksByCommitteeNameAndMonth = async (name, month) => {
    const committee = await Committee.findOne({
        where: { committee_name: name }
    })
    const committee_id = committee.committee_id;
    const tasks = await Task.findAll({
        where: { committee_id: committee_id, month: month },
        include: [
            {
                model: User,
                attributes: ["user_name", "image"]
            }
        ]
    });
    return tasks
}

const deleteUserTaskByUserIdAndTaskId = async (user, task) => {
    try {
        const user_task = await User_Task.destroy({
            where: { user_id: user, task_id: task }
        })
        return user_task

    } catch (error) {
        console.log(error)
    }
}

const deleteTaskById = async (id) => {
    try {
        const task = await Task.destroy({
            where: { task_id: id }
        })
        return task

    } catch (error) {
        console.log(error)
    }
}


const TaskRepo = {
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

module.exports = { TaskRepo }