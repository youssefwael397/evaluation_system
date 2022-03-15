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
        const new_task = TaskController.createNewTask(task)
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

router.get('/committee', async (req, res) => {
    const tasks = await TaskController.getTasksByCommitteeName(req.query['name']);
    res.send({
        status: 'ok',
        tasks
    })
})

router.get('/user', async (req, res) => {
    const tasks = await TaskController.getTasksByUserName(req.query['name']);
    res.send({
        status: 'ok',
        tasks
    })
})

router.post('/insert', upload.none(), async (req, res) => {

    const user_task = {
        task_name: req.body.task_name,
        user_name: req.body.user_name,
        value: req.body.value
    }

    try {
        const new_user_task = await TaskController.InsertValue(user_task)
        res.send({
            status: 'ok',
            new_user_task
        })
    } catch (error) {
        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }

})

module.exports = router
