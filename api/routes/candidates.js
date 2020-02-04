const express = require('express');
const router = express.Router();

const CandidateController = require("../controllers/candidate");

router.get('/',CandidateController.get_cadidate_list);

router.post('/signup',CandidateController.add_candidate);

router.delete('/:candidateId', (req, res, next) => {
    res.status(201).json({
        message: "Delete Succesffully"
    });
});
router.post('/login',CandidateController.login_candidate);

router.patch('/:candidateId', (req, res, next) => {
    res.status(201).json({
        message: "Patch Succesffully"
    });
});
module.exports = router;