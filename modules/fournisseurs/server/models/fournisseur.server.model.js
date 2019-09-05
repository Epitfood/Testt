'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Fournisseur Schema
 */
var FournisseurSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Fournisseur name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Fournisseur', FournisseurSchema);
