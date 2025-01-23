import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "sua_chave_secreta";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const token = req.cookies.token; // Supondo que o token JWT esteja armazenado nos cookies

    if (!token) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    try {
      // Verifique e decodifique o token JWT
      const decoded: any = jwt.verify(token, SECRET_KEY);
      const { id: ownerId } = decoded;

      const { name, species, birthDate } = req.body;

      if (!name || !species) {
        return res
          .status(400)
          .json({ message: "Nome e espécie são obrigatórios." });
      }

      const pet = await prisma.pet.create({
        data: {
          name,
          species,
          birthDate: birthDate ? new Date(birthDate) : null,
          ownerId, // Relaciona o pet ao usuário autenticado
        },
      });

      return res.status(201).json(pet);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao cadastrar pet." });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: "Método não permitido." });
  }
}
