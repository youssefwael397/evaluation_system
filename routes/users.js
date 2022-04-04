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
const haram_encrypt = require('../env')
const jwt = require('jsonwebtoken');

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

// get user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await UserController.getUserById(req.params.id);
        res.send({
            status: 'ok',
            user
        })

    } catch {
        res.status(403).send({
            status: "error",
            error
        })
    }

})

// get all members of special committee
// router.get('/committee/:name', async (req, res) => {
//     const users = await UserController.getUsersByCommitteeName(req.params.name);
//     res.send({
//         status: 'ok',
//         users
//     })
// })


// get active or disactive members of all committees or special committee
router.get('/', async (req, res) => {

    const token = req.body.token || req.headers.authorization
    const { active, committee } = req.query;
    console.log("welcome")
    try {
        console.log(haram_encrypt)
        if (AdminAuthorization(token, haram_encrypt, res)) {
            console.log("authorized")
            if (active == 1) {
                console.log("active")
                if (committee != null) {
                    console.log("active by id")
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
                if (active == 0) {
                    if (committee != null) {
                        const disactive_users = await UserController.getDisActiveUsersByCommitteeId(committee);
                        res.send({
                            status: 'ok',
                            disactive_users
                        })
                    } else {
                        const disactive_users = await UserController.getAllDisActiveUsers();
                        res.send({
                            status: 'ok',
                            disactive_users
                        })
                    }
                }

            }
        }
    } catch (error) {
        res.status(403).send({
            status: 'error',
            error
        })
    }

})

// create new member
router.post('/create', upload.single('image'), async (req, res) => { // upload.none()
    try {
        const image = req.file;
        const user = { ...req.body, image: image.filename }
        const signUser = await UserController.createNewUser(user)
        console.log(signUser)
        if (signUser) {
            res.send({
                status: 'ok',
                "user": signUser
            })
        } else {
            res.status(400).send({
                status: 'error',
                "error": "Duplicate information, please try again."
            })
        }

    } catch (error) {
        res.status(400).send({
            'status': 'error',
            error
        })
    }

})

// update image by user id and image
router.put('/update/image', upload.single('image'), async (req, res) => {

    try {
        const user_id = req.body.user_id;
        const image = req.file;

        const updated_user = await UserController.UpdateImage(user_id, image.filename);

        res.send({
            status: 'ok',
            updated_user
        })

    } catch (error) {
        res.status(403).send({
            status: 'error',
            error
        })
    }


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

// add second committee by user_id, committee_id
router.put('/addcommittee', upload.none(), async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const user = req.body;

    try {
        if (user) {
            if (AdminAuthorization(token, haram_encrypt, res)) {
                const edited_user = await UserController.addSecondCommittee(user);
                res.send({
                    status: 'ok',
                    edited_user
                })
            }
        }

    } catch (error) {
        res.status(403).send({
            status: "error",
            error
        })
    }

})

// accept request of member by user Id and committee id
router.put('/activate', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const { user, committee } = req.query;

    try {
        if (AdminAuthorization(token, haram_encrypt, res)) {
            const updated_user = await UserController.ActivateUser(user, committee);
            res.send({
                status: 'ok',
                updated_user
            })
        }
    } catch (error) {
        res.status(403).send({
            status: "error",
            error
        })
    }

})

// disactive member by user Id and committee id
router.put('/disactivate', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const { user, committee } = req.query;

    try {
        if (AdminAuthorization(token, haram_encrypt, res)) {
            const updated_user = await UserController.DisActivateUser(user, committee);
            res.send({
                status: 'ok',
                updated_user
            })
        }
    } catch (error) {
        res.status(403).send({
            status: "error",
            error
        })
    }

})


module.exports = router
