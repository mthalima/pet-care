import { useState } from "react";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PET_OWNER"); // Valor padrão
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        router.push("/login"); // Redireciona para o login após sucesso
      } else {
        const { message } = await response.json();
        setError(message || "Erro ao registrar usuário.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h1>Registrar</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tipo de Conta:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="PET_OWNER">Dono de Pet</option>
            <option value="CARETAKER">Cuidador</option>
          </select>
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;
