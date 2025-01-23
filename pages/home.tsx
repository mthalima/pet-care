import { useEffect, useState } from "react";

type Pet = {
  id: number;
  name: string;
  species: string;
  birthDate?: string;
};

const HomePage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("/api/pets");
        if (response.ok) {
          const data = await response.json();
          setPets(data);
        }
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Seus Pets</h1>
      {pets.length === 0 ? (
        <p>Você ainda não cadastrou nenhum pet.</p>
      ) : (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              {pet.name} - {pet.species}
              {pet.birthDate &&
                ` (Nascido em ${new Date(pet.birthDate).toLocaleDateString()})`}
            </li>
          ))}
        </ul>
      )}
      <a href="/add-pet">Adicionar Pet</a>
    </div>
  );
};

export default HomePage;
