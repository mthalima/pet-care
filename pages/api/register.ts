import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  try {
    // Log para verificar os dados recebidos
    console.log("Dados recebidos:", req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log("Usuário criado:", newUser);

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro ao criar usuário" });
  } finally {
    await prisma.$disconnect();
  }
}
