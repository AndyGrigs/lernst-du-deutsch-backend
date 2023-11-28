const mongoose = require('mongoose');

const grammarPartSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  name: String,
});

const GrammarPart = mongoose.model('GrammarPart', grammarPartSchema);

export default GrammarPart;
