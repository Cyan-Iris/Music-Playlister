const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String,
        }], required: true },
        publish:{type:Boolean, required:true},
        comments:{type:[String],required:true},
        upVote:{type:[String],required:true},
        downVote:{type:[String],required:true},
        createTime:{type:Number,requried:true},
        authorName:{ type: String, required: true },
        view:{type:Number,required:true},

    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
