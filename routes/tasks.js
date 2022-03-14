const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');

router.get('/', (req, res) => {
    res.send('welcome from tasks')
})

module.exports = router
