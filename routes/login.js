const { LoginController } = require('../controllers/LoginController')
const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()


router.post('/', upload.none(), async (req, res) => {
    const login_user = req.body;
    const login_token = await LoginController.login(login_user);

    res.send({
        status: 'ok',
        login_token
    })

})

module.exports = router
