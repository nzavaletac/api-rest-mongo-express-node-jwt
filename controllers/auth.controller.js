import { validationResult } from "express-validator";

export const register = (req, res) => {
  res.json({ ok: "Register"  });
};

export const login = (req, res) => {
  res.json({ ok: "login" });
};
