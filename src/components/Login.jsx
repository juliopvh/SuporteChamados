// src/components/Login.jsx
import { useState } from "react";
import { API_BASE_URL } from "../config/api";

export default function Login({ onLoginSucesso }) {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagemSucesso("");
    setCarregando(true);

    const url = modoCadastro
      ? `${API_BASE_URL}/api/auth/cadastrar`
      : `${API_BASE_URL}/api/auth/login`;

    const corpo = modoCadastro ? { nome, email, senha } : { email, senha };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });

      const dados = await res.json();

      if (!res.ok) {
        throw new Error(dados.erro || "Falha na operação.");
      }

      if (modoCadastro) {
        setMensagemSucesso("Conta criada com sucesso! Faça login para continuar.");
        setModoCadastro(false);
        setSenha("");
      } else {
        localStorage.setItem("token_chamados", dados.token);
        localStorage.setItem("usuario_chamados", JSON.stringify(dados.usuario));
        onLoginSucesso(dados.usuario, dados.token);
      }
    } catch (err) {
      setErro(err.message || "Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className="login-container"
      style={{
        maxWidth: "420px",
        margin: "60px auto",
        padding: "28px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
      >
        <h2 style={{ textAlign: "center", color: "#1e293b" }}>
          🔐 {modoCadastro ? "Criar Conta" : "Login no Sistema"}
        </h2>

        {erro && (
          <div
            className="mensagem-erro"
            style={{
              padding: "10px",
              background: "#fee2e2",
              color: "#dc2626",
              borderRadius: "6px",
              fontSize: "0.85rem",
            }}
          >
            {erro}
          </div>
        )}

        {mensagemSucesso && (
          <div
            style={{
              padding: "10px",
              background: "#dcfce7",
              color: "#15803d",
              borderRadius: "6px",
              fontSize: "0.85rem",
            }}
          >
            {mensagemSucesso}
          </div>
        )}

        {modoCadastro && (
          <div className="form-group">
            <label>Nome Completo:</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>
        )}

        <div className="form-group">
          <label>E-mail:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="******"
          />
        </div>

        <button
          type="submit"
          className="btn-salvar"
          disabled={carregando}
          style={{ opacity: carregando ? 0.7 : 1, marginTop: "6px" }}
        >
          {carregando
            ? "Conectando ao servidor..."
            : modoCadastro
            ? "Cadastrar"
            : "Entrar"}
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#2563eb",
            cursor: "pointer",
            marginTop: "10px",
          }}
          onClick={() => {
            setModoCadastro(!modoCadastro);
            setErro("");
            setMensagemSucesso("");
          }}
        >
          {modoCadastro
            ? "Já tem conta? Faça Login"
            : "Não tem conta? Cadastre-se aqui"}
        </p>
      </form>
    </div>
  );
}
