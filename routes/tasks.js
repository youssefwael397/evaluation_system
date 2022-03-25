const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const { TaskController } = require('../controllers/TaskController');
const upload = multer()

// create a new task in specific committee
router.post('/create', upload.none(), async (req, res) => {

    const task = {
        task_name: req.body.task_name,
        task_value: req.body.task_value,
        type: req.body.type,
        committee_id: req.body.committee_id
    }

    try {
        const new_task = await TaskController.createNewTask(task)
        if (new_task) {
            res.send({
                status: 'ok',
                message: `${task_name} successfully added.`
            })
        } else {
            res.status(500).send({
                status: 'error',
                message: `Failed in adding ${task_name}`
            })
        }
    } catch (error) {
        res.status(500).send({
            'status': 'error',
            'error': error
        })
    }

})

// get all tasks of specific committee
router.get('/', async (req, res) => {
    const { committee, user, type } = req.query

    try {
        if (committee != null) {
            if (user != null) {
                if (type != null) {
                    const tasks = await TaskController.getTasksByCommitteeNameAndUserIdAndType(committee, user, type);
                    res.send({
                        status: 'ok',
                        tasks
                    })
                }
                const tasks = await TaskController.getTasksByCommitteeNameAndUserId(committee, user);
                res.send({
                    status: 'ok',
                    tasks
                })
            }
            const tasks = await TaskController.getTasksByCommitteeName(committee);
            res.send({
                status: 'ok',
                tasks
            })
        } else {
            res.send({
                status: 'ok',
                message: "committee name and user id must not br empty."
            })
        }
    } catch (error) {
        res.status(500).send({
            status: 'error',
            error: error
        })
    }


})

// get user tasks of specific committee by user id
router.get('/user/:id', async (req, res) => {
    const tasks = await TaskController.getTasksByUserId(req.params['id']);
    res.send({
        status: 'ok',
        tasks
    })
})


router.get('/users/:committee_id', async (req, res) => {

    const tasks = await TaskController.getUsersTasksByCommitteeId(req.params.committee_id);
    res.send({
        status: 'ok',
        tasks
    })
})

// Enter user value of specific task
router.post('/insert', async (req, res) => {
    const users_task = {
        users: req.body.users,
        task: req.body.task,
        value: req.body.value
    }

    try {
        const new_users_task = await TaskController.InsertValue(users_task)
        console.log(new_users_task)
        res.send({
            status: 'ok',
            new_users_task
        })
    } catch (error) {
        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }
})

module.exports = router
