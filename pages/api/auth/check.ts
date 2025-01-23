import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "sua_chave_secreta";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token; // Supondo que o token JWT esteja nos cookies

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return res.status(200).json({ message: "Autenticado" });
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
