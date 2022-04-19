const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const { TaskController } = require('../controllers/TaskController');
const upload = multer()
const jwt = require('jsonwebtoken');
const haram_encrypt = require('../env');
const { UserController } = require('../controllers/UserController');

const AdminAuthorization = (token, encrypt, res) => {
    if (token) {
        const verify = jwt.verify(token, encrypt)
        if (verify) {
            const decodedToken = jwt.decode(token)
            if (decodedToken.is_admin == 1) {
                return true
            } else {
                res.status(500).send({
                    "status": 'error',
                    "error": "Only admins can access this request"
                })
            }
        } else {
            res.status(400).send({
                "status": 'error',
                "error": "Unverified token"
            })
        }
    } else {
        res.status(503).send({
            "status": 'error',
            "error": "The token must be in request"
        })
    }
}

// create a new task in specific committee
router.post('/create', upload.none(), async (req, res) => {

    const token = req.body.token || req.headers.authorization;
    const task = {
        task_name: req.body.task_name,
        task_value: req.body.task_value,
        type: req.body.type,
        committee_id: req.body.committee_id,
        month: req.body.month
    };

    try {
        if (AdminAuthorization(token, haram_encrypt, res)) {
            const new_task = await TaskController.createNewTask(task)
            if (new_task) {
                res.send({
                    status: 'ok',
                    message: `${new_task.task_name} successfully added.`
                })
            } else {
                res.status(500).send({
                    status: 'error',
                    error: `Failed in adding ${new_task.task_name}`
                })
            }
        }

    } catch (error) {
        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }

})

// get all tasks of specific committee
router.get('/', async (req, res) => {
    try {
        const { committee, user, type, month } = req.query

        if (committee != null) {
            if (user != null) {
                if (type != null) {
                    if (month != null) {
                        const tasks = await TaskController.getTasksByCommitteeNameAndTypeAndMonthAndUser(user, committee, type, month);
                        res.send({
                            status: 'ok',
                            tasks
                        })
                    } else {
                        const tasks = await TaskController.getTasksByCommitteeNameAndUserIdAndType(committee, user, type);
                        res.send({
                            status: 'ok',
                            tasks
                        })
                    }

                } else {
                    if (month != null) {
                        const tasks = await TaskController.getTasksByCommitteeNameAndUserIdAndMonth(committee, user, month);
                        res.send({
                            status: 'ok',
                            tasks
                        })
                    } else {
                        const tasks = await TaskController.getTasksByCommitteeNameAndUserId(committee, user);
                        res.send({
                            status: 'ok',
                            tasks
                        })
                    }
                }

            } else {
                if (type != null) {
                    if (month != null) {
                        const tasks = await TaskController.getTasksByCommitteeNameAndTypeAndMonth(committee, type, month);
                        res.send({
                            status: 'ok',
                            tasks
                        })
                    } else {
                        const tasks = await TaskController.getTasksByCommitteeNameAndType(committee, type);
                        res.send({
                            status: 'ok',
                            tasks
                        })
                    }

                } else {
                    if (month != null) {
                        const tasks = await TaskController.getTasksByCommitteeNameAndMonth(committee, month);
                        console.log(tasks)
                        res.send({
                            status: 'ok',
                            tasks
                        })
                    } else {
                        const tasks = await TaskController.getTasksByCommitteeName(committee);
                        res.send({
                            status: 'ok',
                            tasks
                        })
                    }

                }
            }

        } else {
            res.status(403).send({
                status: 'error',
                "error": "committee name must not br empty."
            })
        }

    } catch (error) {
        console.log(error)
        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }


})


// get user tasks of specific committee by user id and task type
router.get('/user/:id', async (req, res) => {
    try {
        const token = req.body.token || req.headers.authorization
        const tasks = await TaskController.getTasksByUserId(req.params['id']);
        res.send({
            status: 'ok',
            tasks
        })

    } catch (error) {
        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }
})

// get users of specific task
router.get('/:id', async (req, res) => {
    try {
        const task = await TaskController.getUsersByTaskId(req.params['id']);
        res.send({
            status: 'ok',
            task
        })

    } catch (error) {
        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }
})



router.get('/users/:id', async (req, res) => {
    try {
        const task_users = await TaskController.getTaskUsers(req.params['id']);
        res.send({
            status: 'ok',
            task_users
        })

    } catch (error) {

        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }
})


router.delete('/', async (req, res) => {
    const token = req.body.token || req.headers.authorization;
    const { user, task } = req.query
    console.log(user)
    console.log(task)
    try {
        if (AdminAuthorization(token, haram_encrypt, res)) {
            console.log('authorized')
            if (user) {
                if (task) {
                    const user_task = await TaskController.deleteUserTaskByUserIdAndTaskId(user, task)
                    res.send({
                        status: 'ok',
                        user_task
                    })
                }
            } else {
                if (task) {
                    const deleted_task = await TaskController.deleteTaskById(task)
                    res.send({
                        status: 'ok',
                        deleted_task
                    })
                }

            }

        }

    } catch (error) {
        res.status(400).send({
            status: 'error',
            error
        })
    }
})

router.get('/users/:committee_id', async (req, res) => {

    try {
        const token = req.body.token || req.headers.authorization

        if (AdminAuthorization(token, haram_encrypt)) {
            const tasks = await TaskController.getUsersTasksByCommitteeId(req.params.committee_id);
            res.send({
                status: 'ok',
                tasks
            })
        }
    } catch (error) {
        res.status(503).send({
            status: 'error',
            error
        })
    }

})

// Enter user value of specific task
router.post('/insert', async (req, res) => {
    const users_task = {
        users: req.body.users,
        task: req.body.task,
        value: +req.body.value
    }

    const token = req.body.token || req.headers.authorization
    try {
        if (AdminAuthorization(token, haram_encrypt)) {
            console.log('admin and insert to ')
            console.log(users_task)
            const new_users_task = await TaskController.InsertValue(users_task)
            res.send({
                status: 'ok',
                new_users_task
            })
        }
    } catch (error) {
        res.status(501).send({
            status: 'error',
            error
        })
    }

})



module.exports = router
