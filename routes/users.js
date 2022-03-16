const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/UserController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, '/' + file.fieldname + '-' + uniqueSuffix + '.png')
    }
})
const upload = multer({ storage: storage })

// get all users of spe
router.get('/', async (req, res) => {
    const users = await UserController.getAllUsers();
    res.send({
        status: 'ok',
        users
    })
})

// get user by id
router.get('/:id', async (req, res) => {
    const user = await UserController.getUserById(req.params['id']);
    res.send({
        status: 'ok',
        user
    })
})

// get all members of special committee
router.get('/committee/:name', async (req, res) => {
    const users = await UserController.getUsersByCommitteeName(req.params.name);
    res.send({
        status: 'ok',
        users
    })
})

// get active members of special committee
router.get('/', async (req, res) => {
    const active_users = await UserController.getActiveUsers(req.query['name']);
    res.send({
        status: 'ok',
        active_users
    })
})

// get disactive members of special committee
router.get('/disactive/committee', async (req, res) => {
    const disactive_users = await UserController.getDisActiveUsers(req.query['name']);
    res.send({
        status: 'ok',
        disactive_users
    })
})

// create new member
router.post('/create', upload.single('image'), async (req, res) => { // upload.none()

    const image = req.file;
    const user = { ...req.body, image: image.filename }

    try {
        await UserController.createNewUser(user)
        res.send({
            status: 'ok',
            user
        })
    } catch (error) {
        res.status(403).send({
            'status': 'error',
            'error': error
        })
    }

})

// update image by user id and image
router.put('/update/image', upload.single('image'), async (req, res) => {
    const user_id = req.body.id;
    const image = req.file;

    const updated_user = await UserController.UpdateImage(user_id, image.filename);

    res.send({
        status: 'ok',
        updated_user
    })

})


// accept request of member by id
router.put('/activate', async (req, res) => {

    const updated_user = await UserController.ActivateUser(req.query['id']);
    res.send({
        status: 'ok',
        updated_user
    })

})
module.exports = router