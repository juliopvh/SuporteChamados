import Header from './components/Header'
import ChamadoCard from './components/ChamadoCard'
import './App.css'

export default function App() {
  return (
    <div className="app-container">
      {/* Usando o componente Header */}
      <Header />

      <main className="main-content">
        <div className="top-bar">
          <h2>Chamados Recentes</h2>
          <button className="btn-novo">+ Novo Chamado</button>
        </div>

        {/* Renderizando vários cartões de chamados */}
        <section className="lista-chamados">
          <ChamadoCard />
          <ChamadoCard />
          <ChamadoCard />
        </section>
      </main>
    </div>
  );
}