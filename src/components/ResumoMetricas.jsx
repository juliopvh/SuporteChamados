// src/components/ResumoMetricas.jsx

export default function ResumoMetricas() {
  // Criamos um objeto com os valores fictícios das métricas
  const metricas = {
    total: 12,
    abertos: 5,
    concluidos: 7,
  };

  return (
    <section className="metricas-container">
      {/* Card 1: Total */}
      <div className="metrica-card card-total">
        <span className="metrica-titulo">Total de Chamados</span>
        <strong className="metrica-valor">{metricas.total}</strong>
      </div>

      {/* Card 2: Abertos */}
      <div className="metrica-card card-abertos">
        <span className="metrica-titulo">Chamados Abertos</span>
        <strong className="metrica-valor">{metricas.abertos}</strong>
      </div>

      {/* Card 3: Concluídos */}
      <div className="metrica-card card-concluidos">
        <span className="metrica-titulo">Chamados Concluídos</span>
        <strong className="metrica-valor">{metricas.concluidos}</strong>
      </div>
    </section>
  );
}
