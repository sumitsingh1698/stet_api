const mongoose = require('mongoose');

const IncrementId = require('../models/incrementId');


exports.create_application_no = () => {
    IncrementId.find().exec().then(
      result => { 
          console.log("enter into IncrementId");
          if(result.length == 0){
            const id = new IncrementId({
                lastid: 2020019100001
            });
            id.save().then((_)=>{
              return id;
            }).catch(err =>{
                console.log(err);
            });
          }else{
              console.log("here");
              const id = result[0].lastid+1;
              IncrementId.update({_id:result[0].id},{$set:{"lastid":id}});
              return id;
          }
      }
    ).catch(err =>{
        console.log(err);
    });
};