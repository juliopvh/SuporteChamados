// src/components/ChamadoCard.jsx
import { useState } from "react";

// Recebendo as props desestruturadas entre chaves {}
export default function ChamadoCard({
  id,
  titulo,
  descricao,
  prioridade,
  statusInicial,
  data,
}) {
  // Criamos um estado interno 'status' iniciado com a prop 'statusInicial'
  const [status, setStatus] = useState(statusInicial);

  // Função disparada pelo evento onClick para alterar o status
  function alternarStatus() {
    if (status === "Aberto") {
      setStatus("Em Andamento");
    } else if (status === "Em Andamento") {
      setStatus("Concluído");
    } else {
      setStatus("Aberto");
    }
  }

  // Define a classe CSS dinâmica baseada no estado atual do status
  const classeStatus = status.toLowerCase().replace(" ", "-");

  return (
    <article className="chamado-card">
      <div className="chamado-header">
        <span className="chamado-id">#{id}</span>
        {/* Renderização condicional de classe CSS */}
        <span className={`status-badge status-${classeStatus}`}>{status}</span>
      </div>

      <h3 className="chamado-titulo">{titulo}</h3>
      <p className="chamado-descricao">{descricao}</p>

      <div className="chamado-footer">
        <span className="prioridade">
          Prioridade: <strong>{prioridade}</strong>
        </span>
        <span className="data">{data}</span>
      </div>

      {/* Botão com manipulador de evento onClick */}
      <button className="btn-status" onClick={alternarStatus}>
        🔄 Alterar Status
      </button>
    </article>
  );
}
