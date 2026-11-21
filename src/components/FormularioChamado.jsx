// src/components/FormularioChamado.jsx
import { useState } from "react";

export default function FormularioChamado({ onAdicionarChamado, salvando = false }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("Baixa");
  const [erro, setErro] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim()) {
      setErro("Por favor, preencha o título e a descrição!");
      return;
    }

    const novoChamado = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      prioridade,
    };

    onAdicionarChamado(novoChamado);

    setTitulo("");
    setDescricao("");
    setPrioridade("Baixa");
    setErro("");
  }

  return (
    <form className="form-chamado" onSubmit={handleSubmit}>
      <h3>➕ Cadastrar Novo Chamado</h3>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <div className="form-group">
        <label htmlFor="titulo">Título do Chamado:</label>
        <input
          id="titulo"
          type="text"
          placeholder="Ex: Teclado com defeito"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          disabled={salvando}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="descricao">Descrição do Problema:</label>
        <textarea
          id="descricao"
          rows="3"
          placeholder="Descreva o problema detalhadamente..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={salvando}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
          disabled={salvando}
        >
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn-salvar"
        disabled={salvando}
        style={{ opacity: salvando ? 0.7 : 1 }}
      >
        {salvando ? "Salvando Chamado..." : "Salvar Chamado"}
      </button>
    </form>
  );
}
