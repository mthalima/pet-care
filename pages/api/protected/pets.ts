import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../utils/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const authHeader = req.headers.authorization;
      console.log("Token recebido no backend:", authHeader);
      const ownerId = verifyToken(req); // Verifica a autenticação

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
    } catch (error: any) {
      console.error("Erro na autenticação:", error.message);
      return res.status(401).json({ message: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: "Método não permitido." });
  }
}
