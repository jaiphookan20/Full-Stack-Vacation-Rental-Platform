const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    //for diff users, we need to know who is the owner of which place (here we'll have the id of a user)
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    /* Explanation of owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, & its purpose:

    The purpose of this field 'owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},'is to establish a relationship 
    between a Place document and a User document. By referencing the User model, it allows you to associate 
    a Place document with a specific user who owns or manages that place.

    The value of the owner field will be an ObjectId representing the unique identifier of the 
    associated User document. This creates a link or reference between the Place and User collections 
    in the database.

    With this setup, you can use MongoDB's population feature to retrieve the associated User document 
    when querying the Place collection. This allows you to easily access details about the owner of 
    a place, such as their name, email, or any other properties defined in the User model.

    */

    title: String,
    address: String,
    photos: [String], // Array of Strings
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number
});

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;