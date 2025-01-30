import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "sua_chave_secreta";

export const verifyToken = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Usuário não autenticado.");
  }

  const token = authHeader.split(" ")[1];
  const decoded: any = jwt.verify(token, SECRET_KEY);

  if (!decoded.id) {
    throw new Error("Token inválido.");
  }

  return decoded.id; // Retorna o ID do usuário autenticado
};
