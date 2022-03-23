const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const { TaskController } = require('../controllers/TaskController');
const upload = multer()

router.post('/create', upload.none(), async (req, res) => {

    const task = {
        task_name: req.body.task_name,
        task_value: req.body.task_value,
        type: req.body.type,
        committee_id: req.body.committee_id
    }

    try {
        const new_task = await TaskController.createNewTask(task)
        res.send({
            status: 'ok',
            new_task
        })
    } catch (error) {
        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }

})

router.get('/:committee_name', async (req, res) => {
    const tasks = await TaskController.getTasksByCommitteeName(req.params['committee_name']);
    res.send({
        status: 'ok',
        tasks
    })
})

router.get('/user/:name', async (req, res) => {
    const tasks = await TaskController.getTasksByUserName(req.params['name']);
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
