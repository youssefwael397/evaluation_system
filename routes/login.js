const { UserController } = require('../controllers/UserController')
const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()


router.post('/', upload.none(), async (req, res) => {
    try {
        const login_user = req.body;
        const login_token = await UserController.login(login_user);

        if (login_token) {
            res.send({
                status: 'ok',
                login_token
            })
        } else {
            res.status(403).send({
                status: 'error',
                "error": "bad credentials please login again"
            })
        }

    } catch (error) {
        res.status(503).send({
            status: 'error',
            error
        })
    }


})

module.exports = router
