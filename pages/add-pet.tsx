import { useState } from "react";
import { useRouter } from "next/router";

const AddPetPage = () => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          species,
          birthDate,
        }),
      });

      if (response.ok) {
        router.push("/home"); // Redireciona para a Home após sucesso
      } else {
        const { message } = await response.json();
        setError(message || "Erro ao cadastrar pet.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h1>Adicionar Pet</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Espécie:</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data de Nascimento:</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default AddPetPage;
