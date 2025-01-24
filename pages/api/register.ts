import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, name, password, role } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !name || !password || !role) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      // Verifica se o usuário já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "Usuário com este e-mail já existe." });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criação do usuário
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role, // Define o tipo de usuário (Dono ou Cuidador)
        },
      });

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res
        .status(500)
        .json({
          message: "Erro ao criar usuário. Tente novamente mais tarde.",
        });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    // Método não permitido
    return res.status(405).json({ message: "Método não permitido." });
  }
}
