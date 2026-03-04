const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: "User name is required",
      minlength: [3, "User name needs at least 3 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: "User email is required",
      match: [/^\S+@\S+\.\S+$/, "User email must be valid"],
    },
    password: {
      type: String,
      required: "Student password is required",
      minlength: [8, "Student password needs at least 8 chars"],
      match: [/^(?=.*[A-Z])(?=.*\d).{8,}$/, "Password must contain numbers and Mayus"]
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function () {
  const user = this;

  // Solo procesamos la contraseña si fue modificada
  // Esto evita re-hashear una contraseña ya hasheada
  if (user.isModified('password')) {
    try {
      // Generamos el salt (factor de complejidad para el hash)
      const salt = await bcrypt.genSalt(10);
      
      // Hasheamos la contraseña usando el salt generado
      const hash = await bcrypt.hash(user.password, salt);
      
      // Reemplazamos la contraseña en texto plano con el hash seguro
      user.password = hash;
      
      // No llamamos a next() - simplemente retornamos
      // Mongoose sabe que terminamos porque la función async completó
    } catch (error) {
      // Si algo falla (red, memoria, etc.), lanzamos el error
      // Mongoose lo capturará automáticamente y cancelará el guardado
      throw error;
    }
  }
  
  // Si la contraseña no se modificó, simplemente retornamos
  // No hay necesidad de hacer nada más
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
