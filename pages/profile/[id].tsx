import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "../../app/globals.css";

type Pet = {
  id: number;
  name: string;
  species: string;
  age: number;
};

type User = {
  id: number;
  name: string;
  pets: Pet[];
};

const ProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        // Obtém o token JWT do localStorage
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Usuário não autenticado. Faça login para continuar.");
          router.push("/login");
          return;
        }

        // Faz a requisição com o token no cabeçalho de autenticação
        const response = await fetch(`/api/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || "Erro ao carregar os dados do perfil.");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error: any) {
        console.error("Erro ao buscar dados do usuário:", error);
        setError(error.message || "Erro ao carregar os dados do perfil.");
      }
    };

    fetchUserData();
  }, [id, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-orange-600">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Nome do Usuário */}
        <h1 className="text-3xl font-bold text-orange-700 mb-6">
          Perfil de {user.name}
        </h1>

        {/* Lista de Pets */}
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">
          Meus Pets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white border border-orange-200 rounded-lg shadow-lg p-4"
            >
              <h3 className="text-xl font-bold text-orange-700 mb-2">
                {pet.name}
              </h3>
              <p className="text-orange-600">
                <strong>Espécie:</strong> {pet.species}
              </p>
              <p className="text-orange-600">
                <strong>Idade:</strong> {pet.age} anos
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
