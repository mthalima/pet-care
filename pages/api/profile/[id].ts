import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma"; // Ajuste o caminho para o seu cliente Prisma

const SECRET_KEY = process.env.SECRET_KEY || "sua_chave_secreta";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id } = req.query; // ID do usuário na rota
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };

    // Garante que o usuário autenticado só pode acessar seu próprio perfil
    if (decoded.userId !== Number(id)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    // Busca os dados do usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { pets: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
