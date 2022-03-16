const { UserController } = require('../controllers/UserController')
const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()


router.post('/', upload.none(), async (req, res) => {
    const login_user = req.body;
    const login_token = await UserController.login(login_user);

    res.send({
        status: 'ok',
        login_token
    })

})

module.exports = router
