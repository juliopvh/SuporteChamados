// src/components/ChamadoCard.jsx

export default function ChamadoCard() {
  // Simulando dados estáticos de um chamado
  const chamado = {
    id: 101,
    titulo: "Impressora do setor financeiro não responde",
    descricao: "Ao enviar documentos para impressão, ocorre erro de comunicação de rede no 2º andar.",
    prioridade: "Alta",
    status: "Aberto",
    data: "14/11/2026"
  };

  return (
    <article className="chamado-card">
      <div className="chamado-header">
        <span className="chamado-id">#{chamado.id}</span>
        <span className={`status-badge status-${chamado.status.toLowerCase()}`}>
          {chamado.status}
        </span>
      </div>

      <h3 className="chamado-titulo">{chamado.titulo}</h3>
      <p className="chamado-descricao">{chamado.descricao}</p>

      <div className="chamado-footer">
        <span className="prioridade">Prioridade: <strong>{chamado.prioridade}</strong></span>
        <span className="data">{chamado.data}</span>
      </div>
    </article>
  );
}