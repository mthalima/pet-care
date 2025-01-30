import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { withAuth } from "../../utils/authUtils";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      const token = withAuth(router);

      if (!token) {
        setError("Você precisa estar autenticado para acessar esta página.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || "Erro ao carregar os dados do perfil.");
        }

        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-orange-600">Carregando dados do perfil...</p>
      </div>
    );
  }

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
        <p className="text-orange-600">Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">
          Perfil de {user.name}
        </h1>
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">
          Meus Pets
        </h2>

        <button
          onClick={() => router.push("/add-pet")}
          className="mb-6 px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition"
        >
          Adicionar Novo Pet
        </button>

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
