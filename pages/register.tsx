import { useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(""); // Reset the message

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Usuário criado com sucesso: ${data.email}`);
        setEmail("");
        setPassword("");
      } else {
        const errorData = await response.json();
        setMessage(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("Erro ao conectar com o servidor.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h1>Registrar Usuário</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Senha:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Registrar
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "1rem",
            color: message.startsWith("Erro") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterPage;
