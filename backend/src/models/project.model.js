const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: "Project name is required",
      unique: true,
    },
    description: {
      type: String,
      maxlength: [1000, `You can't write more than 1000 characters`],
    },
    state: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
    start: {
      type: Date,
      required: "Start date is required",
    },
    delivery: {
      type: Date,
      required: "You need to put the delivery date",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  },
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
