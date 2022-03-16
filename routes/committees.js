const express = require('express');
const router = express.Router();
const { CommitteeController } = require('../controllers/CommitteController')
const multer = require('multer');
const upload = multer()

// get all committees
router.get('/all', async (req, res) => {
    const committees = await CommitteeController.getAllCommittees();
    res.send({
        status: 'ok',
        committees
    })
})

// get committee by id
router.get('/', async (req, res) => {
    console.log(req.params.id)
    const committee = await CommitteeController.getCommitteeById(req.params.id);
    res.send({
        status: 'ok',
        committee
    })
})


// create all committees
// router.get('/create/all', (req, res) => {
//     const committees = CommitteeController.createCommittees();
//     res.send({
//         status: 'ok',
//         data: committees
//     })
// })

module.exports = router
