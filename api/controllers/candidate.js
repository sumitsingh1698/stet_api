const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");


const IncrementId = require("../models/incrementId");
const Candidate = require("../models/candidate");


// Add Candidate Request Handling -------------------------//

exports.add_candidate = (req, res, next) => {

   //password encryt by bcrypt--//
   bcrypt.hash(req.body.password, 10, (err, hash) => {
      var id;
      if (err) {
         return res.status(500).json({
            error: err
         });
      } else {

         //After password hashed without any error 
         //Checked LastId is there is not 
         //if there then create new Id 
         //else increment the lastId by one

         IncrementId.find().exec().then(ids => {
            if (ids.length == 0) {

               const id = new IncrementId({
                  _id: mongoose.Types.ObjectId(),
                  lastid: 2020019100001
               });
               id.save().then((idsave) => {
                  createCandidate(req, res, hash, idsave.lastid);
                  console.log(idsave.lastid);
               });
            } else {

               console.log("application no: " + ids[0]._id);
               const id = ids[0].lastid + 1;
               console.log("update id" + id);
               IncrementId.updateOne({ _id: ids[0]._id }, { $set: { lastid: id } }, (err, any) => {
                  if (err) {
                     new Error("error in update application");
                  } else {
                     createCandidate(req, res, hash, id);
                  }
               });

            }
         });

      }
   });
};

// Adding Candidate in database

function createCandidate(req, res, hash, id) {
   Candidate.find({ email: req.body.email }).exec().then(
      result => {
         if (result.length >= 1) {
            return res.status(409).json({
               message: "Mail exists"
            });
         } else {

            const candidate = new Candidate({
               _id: mongoose.Types.ObjectId(),
               email: req.body.email,
               password: hash,
               mobileno: req.body.mobileno,
               applicationno: id,
               first_name: req.body.first_name,
               last_name: req.body.last_name,
               addharno: req.body.addharno,
            });
            candidate.save().then(candidateUpdate => {
               res.status(201).json({
                  message: 'update successfully',
                  candidateUpdate: candidateUpdate
               }
               );
            });

         }
      }
   ).catch(err => {
      console.log(err);
   });
}
//----------------end of Add Candidate Handling --------------//

exports.login_candidate = (req, res, next) => {
   console.log(req.body.email);
   Candidate.find({ email: req.body.email }).then(candidate => {
      if (candidate.length < 1)
         return res.status(404).json({
            message: "email not found"
         });
      bcrypt.compare(req.body.password, candidate[0].password, (err, result) => {
         if (err) {
            res.status(500).json({
               error: err
            });
         }
         if (result) {
            const token =  jwt.sign({
               email: candidate[0].email,
               applicationno: candidate[0].applicationno
            },
               process.env.JWT_KEY,
               {
                  expiresIn: '1h'
               }
            );
            return res.status(200).json({
              message:"Successfully Authenticated",
              token: token
            });
         }
         res.status(401).json({
            message: "Password Incorrect"
         });
      });

   }

   ).catch(err => {
      console.log(err);
   })
}

//----------------------- Get all candidate list ----------------------------//


exports.get_cadidate_list = (req, res, next) => {  
 Candidate.find().exec().then(result => {
    res.status(200).json({
      result: result
    });
 });
}