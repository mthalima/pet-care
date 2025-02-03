import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "sua_chave_secreta";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  console.log("Token recebido no backend:", token);
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);

    // Se precisar passar o ID do usuário para as rotas, pode adicionar ao cabeçalho
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("X-User-Id", decoded.id.toString());

    return NextResponse.next({
      headers: requestHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Token inválido ou expirado." },
      { status: 401 }
    );
  }
}

// Define quais rotas serão protegidas pelo middleware
export const config = {
  matcher: ["/api/protected/:path*"], // Protege todas as rotas dentro de /api/
};
