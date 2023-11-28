import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    name: String,
    moduleGrammar: [{type: mongoose.Schema.Types.ObjectId, ref: 'ModuleGrammar' }],
    videos: [String], 
    text : {
        title: String,
        content: String,
    },
    vocabulary: [
        {
          word: String,
          translation: String,
        }
      ],
      exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModuleExercise' }],
})

const Module = mongoose.model('Module', moduleSchema);

export default Module