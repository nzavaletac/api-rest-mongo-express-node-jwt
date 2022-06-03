import { User } from "../models/User.models.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validacion alternativa 2 buscando por email
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password });
    await user.save();
    // Generar jwt token

    return res.status(201).json({ user });
  } catch (error) {
    // validacion  alternativa 1 por defecti mongoose
    console.log(error.code);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Ya existe este usuario." });
    }
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(403)
        .json({ error: "NO existe el usuario registrado." });
    const respuestaPassword = await user.comparePassword(password);
    if (!respuestaPassword) {
      return res.status(403).json({ error: "Contraseña incorrecta." });
    }
    // Generar jwt token
    const token = jwt.sign(
      { uid: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    return res.json({ token: token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor." });
  }
};
