const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: {
    type: String,
    required: "Client name is required",
    unique: true,
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, "Client email must be valid"],
  },
  phone: {
    type: String,
    match: [/^[+\d\s\-()]{6,15}$/, "Phone number must be valid"],
  },
  company: {
    type: String,
  },
  notes: {
    type: String,
    maxlength: [350, `You can't write more than 350 characters in a note`],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},{
  timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
});

clientSchema.virtual('projects', {
  ref: 'Project',       
  localField: '_id',      
  foreignField: 'client',
  count: true
});

clientSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Project = mongoose.model('Project');
  await Project.deleteMany({ client: this._id });
});

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
