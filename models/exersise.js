const mongoose = require('mongoose');

const sentenceSchema = new mongoose.Schema({
  original: String,
  translation: String,
  wordInGap: String, // Поле для слова в пропуску
  // Інші властивості, якщо потрібно
});

const exerciseSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  sentences: [sentenceSchema],
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
