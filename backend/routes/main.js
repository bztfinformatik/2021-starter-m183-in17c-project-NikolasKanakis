// moudule providing objects and functions for routing
const express = require('express');
// import controller functions
const ctrl = require('../controllers/main');

const router = express.Router();

router.post('/login', ctrl.postLogins); //POST REQUEST
router.get('/users', ctrl.getUsers); //GET REQUEST
router.post('/users', ctrl.postUsers); //POST REQUEST
router.get('/users/:ids', ctrl.getUsers);
router.get('/', ctrl.doNothing);

// just for testing
router.get('/hw', ctrl.getHelloWorld);
router.post('/pm', ctrl.postMessage); //POST REQUEST




module.exports = router;