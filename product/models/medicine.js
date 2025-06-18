const mongoose = require("mongoose")
const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter medicine name"],
        trim: true,
    },
    
    brand: {
        type: String,
        required: [true, "Please enter brand name"]
    },

    description: {
        type: String,
        required: [true, "please enter a description"],
    },

    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: [true, "please enter expriy date "],
        
    },
    prescriptionRequired: {
        type: Boolean,
        default: false,
    },

    image: {
        type: String,
        required: false
    },
      category: {
        type: String,
        required: [true, "Please enter medicine category"],
        enum: ["Pain Relief", "Palm", "Diapers", "Antibiotic", "Allergy", "Diabetes", "Heart", "Digestive", "General","kits","Napkins", "Baby Care","Other"],
        default: "General"
      },
}
    ,
    {
        timestamps: true,
    });
const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;