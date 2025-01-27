import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const SECRET_KEY = process.env.SECRET_KEY || "sua_chave_secreta";

export const authenticate = (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Não autorizado, token ausente" });
    throw new Error("Não autorizado");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // Decodifica o token para usar os dados (como userId)
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado" });
    throw new Error("Token inválido");
  }
};
