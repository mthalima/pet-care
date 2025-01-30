import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../app/globals.css";
import { withAuth } from "../utils/authUtils";

const AddPetPage = () => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authToken = withAuth(router);
    console.log("Token obtido no frontend:", authToken); // 🔍 Log do token no console
    setToken(authToken);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Você precisa estar autenticado para adicionar um pet.");
      return;
    }

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //Token agora é obtido corretamente
        },
        body: JSON.stringify({ name, species, birthDate }),
      });

      if (response.ok) {
        router.push("/home"); //Redireciona após sucesso
      } else {
        const { message } = await response.json();
        setError(message || "Erro ao cadastrar pet.");
      }
    } catch (err) {
      console.error("Erro ao conectar com o servidor:", err);
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-orange-300">
        <h1 className="text-2xl font-bold text-orange-700 text-center mb-4">
          Adicionar Novo Pet
        </h1>
        {error && (
          <p className="text-red-600 text-center bg-red-100 p-2 rounded mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-orange-700 font-semibold">Nome:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-orange-700 font-semibold">
              Espécie:
            </label>
            <input
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-orange-700 font-semibold">
              Data de Nascimento:
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-lg shadow-md hover:bg-orange-700 transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetPage;
