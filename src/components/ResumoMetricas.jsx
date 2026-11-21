// src/components/ResumoMetricas.jsx

export default function ResumoMetricas({ chamados = [] }) {
  const total = chamados.length;

  const abertos = chamados.filter(
    (c) => (c.status || "").toLowerCase() === "aberto"
  ).length;

  const emAndamento = chamados.filter(
    (c) => (c.status || "").toLowerCase() === "em andamento"
  ).length;

  const concluidos = chamados.filter((c) => {
    const s = (c.status || "").toLowerCase();
    return s === "concluído" || s === "concluido";
  }).length;

  return (
    <section className="metricas-container">
      {/* Card 1: Total */}
      <div className="metrica-card card-total">
        <span className="metrica-titulo">Total de Chamados</span>
        <strong className="metrica-valor">{total}</strong>
      </div>

      {/* Card 2: Abertos */}
      <div className="metrica-card card-abertos">
        <span className="metrica-titulo">Abertos</span>
        <strong className="metrica-valor">{abertos}</strong>
      </div>

      {/* Card 3: Em Andamento */}
      <div className="metrica-card card-andamento">
        <span className="metrica-titulo">Em Andamento</span>
        <strong className="metrica-valor">{emAndamento}</strong>
      </div>

      {/* Card 4: Concluídos */}
      <div className="metrica-card card-concluidos">
        <span className="metrica-titulo">Concluídos</span>
        <strong className="metrica-valor">{concluidos}</strong>
      </div>
    </section>
  );
}
