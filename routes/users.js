const express = require('express');
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();
const { UserController } = require('../controllers/UserController')
const multer = require('multer')
const { storage, uploadBytes, uploadString } = require("../firebase")
const { getDownloadURL, ref } = require("firebase/storage");
const { v4: uuid4 } = require('uuid');
const upload = multer({ storage: multer.memoryStorage() })
const haram_encrypt = require('../env')
const jwt = require('jsonwebtoken');
const uploadAndGetUrl = async (image) => {
    const imagesRef = ref(storage, `/images/${uuid4()}.png`)
    console.log(image)
    const snapshot = await uploadBytes(imagesRef, image);
    const URL = await getDownloadURL(snapshot.ref)
    return URL;
}
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


router.get("/board/:committee_name/:month", async (req, res) => {
    const { committee_name, month } = req.params
    const users = await UserController.getLeaderBoard(committee_name, month)
    return res.json(users);
})


// get user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await UserController.getUserById(req.params.id);
        res.send({
            status: 'ok',
            user
        })

    } catch (error) {
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
        const image = req.file.buffer;
        console.log(image)
        const image_url = await uploadAndGetUrl(image.buffer)
        const user = { ...req.body, image: image_url }
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
        console.log(error)
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
        const image = req.file.buffer;
        const image_url = await uploadAndGetUrl(image.buffer)
        const updated_user = await UserController.UpdateImage(user_id, image_url);

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


router.post('/forgetpassword', upload.none(), async (req, res) => {
    const { email } = req.body;

    try {
        const link = await UserController.createResetPasswordLink(email);
        console.log("try link")
        if (!link) {
            res.status(403).send({
                status: "error",
                error: "Email is not exists"
            })
        } else {
            console.log('link is exists in users route')
            let transporter = nodemailer.createTransport({
                // host: 'smtp.gmail.com',
                // port: 587,
                // secure: false, // secure:true for port 465, secure:false for port 587
                service: 'gmail',
                auth: {
                    user: 'spe.su.sc.es@gmail.com',
                    pass: 'spesusces@2022'
                }
            })
            console.log('transporter is created')

            let mailOptions = {
                from: 'youssefwael397@gmail.com',
                to: email,
                subject: 'SPESUSCES Reset Password',
                text: `To save your privacy we must be secure in sensitive data. Now you can reset password from this link ${link}. Note: This Link is valid for 15 minutes.`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log('Error Occurs');
                } else {
                    console.log('Email sent successfully');
                }
            })

            res.send({
                status: 'ok',
                msg: 'Password reset link has been sent. Check your email.'
            })
        }

    } catch (error) {
        res.status(403).send({
            status: "error",
            error: "Failed to send an email."
        })
    }

})


router.post('/resetpassword/:id/:token', upload.none(), async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    console.log(id)
    console.log(token)
    console.log(password)
    try {
        const updated_user = await UserController.resetPassword(id, token, password);
        if (!updated_user) {
            res.status(403).send({
                status: "error",
                error: "Failed to update password"
            })
        } else {
            res.send({
                status: 'ok',
                msg: 'Password has been reset successfully.'
            })
        }

    } catch (error) {
        res.status(403).send({
            status: "error",
            error: "Failed to update password"
        })
    }

})


module.exports = router
