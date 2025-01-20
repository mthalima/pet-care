import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.status(200).json({ message: "Lista de pets" });
  } else if (req.method === "POST") {
    const { name, type } = req.body;
    res.status(201).json({ message: `Pet ${name} do tipo ${type} criado!` });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
