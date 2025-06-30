const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter medicine name"],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, "Please enter brand name"],
    },

    description: {
      type: String,
      required: [true, "Please enter a description"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Please enter quantity"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Please enter price"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: [true, "Please enter expiry date"],
    },

    prescriptionRequired: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      required: [true, "Please provide an image URL"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Please enter medicine category"],
      enum: [
        "Pain Relief",
        "Palm",
        "Diapers",
        "Antibiotic",
        "Allergy",
        "Diabetes",
        "Heart",
        "Digestive",
        "General",
        "kits",
        "Napkins",
        "Baby Care",
        "Other",
      ],
      default: "General",
    },
  },
  {
    timestamps: true, // ✅ Automatically add createdAt and updatedAt fields
  }
);

// ✅ Export the model
const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;
