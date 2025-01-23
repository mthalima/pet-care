import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role, // Define o tipo de usuário
        },
      });

      return res
        .status(201)
        .json({ message: "Usuário criado com sucesso!", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar usuário." });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: "Método não permitido." });
  }
}
