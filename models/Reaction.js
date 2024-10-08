const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactonId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type:String,
            required: true,
            maxlength: 280,
        },
        username: {
            type:String,
            required:true,
        
        },
        createdAt: {
            type:Date,
            default: Date.now,
        },

    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        },
        id: false
    }
);



module.exports = reactionSchema;