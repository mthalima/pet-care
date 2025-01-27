import React, { useState } from "react";
import { useRouter } from "next/router";
import "./../app/globals.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "PET_OWNER",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        await router.push(`/profile/${result.user.id}`);
      } else {
        alert(result.message || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Cadastro de Usuário
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-orange-800 font-medium mb-2"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-600 dark:text-orange-400"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-orange-800 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-600 dark:text-orange-400"
              required
            />
          </div>

          {/* Senha */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-orange-800 font-medium mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-600 dark:text-orange-400"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-orange-800 font-medium mb-2"
            >
              Tipo de Usuário
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-600 dark:text-orange-400"
              required
            >
              <option value="PET_OWNER">Dono de Pet</option>
              <option value="CARETAKER">Cuidador</option>
            </select>
          </div>

          {/* Botão de Cadastro */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
