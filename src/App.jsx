// src/App.jsx
import Header from "./components/Header";
import ResumoMetricas from "./components/ResumoMetricas";
import ChamadoCard from "./components/ChamadoCard";
import "./App.css";

export default function App() {
  // Lista fictícia de chamados (Mock Data)
  const chamados = [
    {
      id: 101,
      titulo: "Impressora do setor financeiro não responde",
      descricao: "Erro de comunicação de rede no 2º andar.",
      prioridade: "Alta",
      statusInicial: "Aberto",
      data: "14/11/2026",
    },
    {
      id: 102,
      titulo: "Computador travando ao iniciar o sistema",
      descricao: "Lentidão recorrente no setor de RH.",
      prioridade: "Média",
      statusInicial: "Em Andamento",
      data: "14/11/2026",
    },
    {
      id: 103,
      titulo: "Solicitação de novo monitor adicional",
      descricao: "Pedido para a estação de trabalho do design.",
      prioridade: "Baixa",
      statusInicial: "Concluído",
      data: "13/11/2026",
    },
  ];

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <ResumoMetricas />

        <div className="top-bar">
          <h2>Chamados Recentes</h2>
          <button className="btn-novo">+ Novo Chamado</button>
        </div>

        {/* Renderização de listas dinâmicas com .map() */}
        <section className="lista-chamados">
          {chamados.map((chamado) => (
            <ChamadoCard
              key={chamado.id} // Prop 'key' é obrigatória no React para listas!
              id={chamado.id}
              titulo={chamado.titulo}
              descricao={chamado.descricao}
              prioridade={chamado.prioridade}
              statusInicial={chamado.statusInicial}
              data={chamado.data}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
