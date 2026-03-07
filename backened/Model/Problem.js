const mongoose = require('mongoose');
const {Schema} = mongoose;
const problemSchema=new Schema({
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
difficulty:{
type:String,
enum:['easy','medium','hard'],
required:true
},
tags:{
    type:String,
    enum:['array','linkedlist','graph','dynamic programming','greedy']
},
visibleTestCases:[
   {
    input:{
        type:String,
        required:true
    },
     output:{
        type:String,
        required:true
    },
     explanation:{
        type:String,
        required:true
    }
   }
],
HiddenTestCases:[
   {
    input:{
        type:String,
        required:true
    },
     output:{
        type:String,
        required:true
    }
   }
],
StartCode:[
    {
        language:{
            type:String,
            required:true
        },
          initialCode:{
            type:String,
            required:true
        }
    }
],
 ReferenceSolution:[
      {
        language:{
            type:String,
            required:true
        },
          completeCode:{
            type:String,
            required:true
        }
    }
 ],
problemCreator:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:true
}
},

{
    timestamps:true
});

const Problem = mongoose.model("problem", problemSchema);
console.log('prblm in model',typeof Problem);
module.exports=Problem;