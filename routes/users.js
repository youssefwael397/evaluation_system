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


// get all members of spe
router.get('/', async (req, res) => {
    const users = await UserController.getAllUsers();
    res.send({
        status: 'ok',
        users
    })
})

// get user by id
router.get('/:id', async (req, res) => {
    const user = await UserController.getUserById(req.params.id);
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

// get active or disactive members of all committees or special committee
router.get('/', async (req, res) => {
    const { active, committee } = req.query;
    if (active == 1) {
        if (committee != null) {
            const active_users = await UserController.getActiveUsersByCommitteeId(committee);
            res.send({
                status: 'ok',
                active_users
            })
        } else {
            const active_users = await UserController.getAllActiveUsers();
            res.send({
                status: 'ok',
                active_users
            })
        }

    } else {
        if (committee != null) {
            const disactive_users = await UserController.getDisActiveUsersByCommitteeId(committee);
            res.send({
                status: 'ok',
                disactive_users
            })
        } else {
            const disactive_users = await UserController.getAllDisActiveUsers(committee);
            res.send({
                status: 'ok',
                disactive_users
            })
        }
    }


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

// edit user information by user id 
router.put('/edit', upload.none(), async (req, res) => {
    const user = req.body;
    const edited_user = await UserController.EditUserById(user);
    res.send({
        status: 'ok',
        edited_user
    })
})

// add second committee by user_id, commiittee_id
router.put('/edit/secondcommittee', upload.none(), async (req, res) => {
    const user = req.body;
    const edited_user = await UserController.addSecondCommittee(user);
    res.send({
        status: 'ok',
        edited_user
    })
})

// accept request of member by user Id and committee id
router.put('/activate', async (req, res) => {
    const { user, committee } = req.query;
    const updated_user = await UserController.ActivateUser(user, committee);
    res.send({
        status: 'ok',
        updated_user
    })
})

// disactive member by user Id and committee id
router.put('/disactivate', async (req, res) => {
    const { user, committee } = req.query;
    const updated_user = await UserController.DisActivateUser(user, committee);
    res.send({
        status: 'ok',
        updated_user
    })
})


module.exports = router
