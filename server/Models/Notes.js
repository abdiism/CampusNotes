const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
    fileName: { // Magaca faylka (Ciwaanka)
        type: String,
        required: true,
    },
    fileDescription: { // Faahfaahinta faylka
        type: String,
    },
    tags: { // Calaamadaha (tags)
        type: [String],
        default: []
    },
    noteContent: { // Qoraalka noodhka
       type: String,
       default: ''
    },
    files: { // Faylka la soo galiyay (haddii uu jiro)
        type: String,
    },
    // --- Cusub: Goobta lagu tiriyo daawashada ---
    viewCount: { // Tirada daawashada noodhka
        type: Number,
        default: 0 // Qiimaha caadiga ah waa 0
    },
    // --- Dhammaad Goobta Cusub ---
    uploadedBy: { // Qofka soo galiyay
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    // Xulashooyinka Schema: Si toos ah ugu dar createdAt iyo updatedAt
    timestamps: true
});

module.exports = mongoose.model("Notes", NoteSchema);