import { NextRouter } from "next/router";

/**
 * Função utilitária para verificar a autenticação do usuário.
 * Redireciona para a página de login se o token não for válido.
 * @param router O objeto NextRouter para redirecionamento.
 * @returns O token de autenticação se estiver presente e válido.
 */
export const withAuth = (router: NextRouter): string | null => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Redireciona para a página de login
    router.push("/login");
    return null;
  }

  return token;
};
