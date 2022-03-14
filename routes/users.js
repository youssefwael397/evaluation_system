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

router.get('/all', async (req, res) => {
    const users = await UserController.getAllUsers();
    res.send({
        status: 'ok',
        users
    })
})

router.get('/active/committee/', async (req, res) => {
    const active_users = await UserController.getActiveUsers(req.query['name']);
    res.send({
        status: 'ok',
        active_users
    })
})

router.get('/disactive/committee', async (req, res) => {
    const disactive_users = await UserController.getDisActiveUsers(req.query['name']);
    res.send({
        status: 'ok',
        disactive_users
    })
})

router.get('/committee', async (req, res) => {
    // console.log(req.query['name'])
    const users = await UserController.getUsersByCommitteeName(req.query['name']);
    res.send({
        status: 'ok',
        users
    })
})

router.get('/update', async (req, res) => {

    const updated_user = await UserController.ActivateUser(req.query['id']);
    res.send({
        status: 'ok',
        updated_user
    })
})


// router.get('/admin/create', async (req, res) => {
//     // console.log(req.query['name'])

//     try {
//         let users = []
//         admins.map(async admin => {
//             const new_admin = await UserController.createNewAdmin(admin);
//             users.push(new_admin);
//         })
//         res.send({
//             status: 'ok',
//             users
//         })
//     } catch (error) {
//         res.send({
//             status: 'error',
//             error
//         })
//     }

// })

router.post('/create', upload.single('image'), async (req, res) => { // upload.none()

    const image = req.file;
    const user = {
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password,
        facebook: req.body.facebook,
        gender: req.body.gender,
        phone: req.body.phone,
        image: image.filename,
        faculty: req.body.faculty,
        university: req.body.university,
        committee_name: req.body.committee_name,
    }

    try {
        UserController.createNewUser(user)
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



module.exports = router