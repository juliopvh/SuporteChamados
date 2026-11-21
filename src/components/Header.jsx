// src/components/Header.jsx
import Contador from "./Contador";

export default function Header({ usuario, totalResolvidos = 0, onLogout }) {
  const nomeExibido = usuario?.nome || "Usuário";

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-brand">
          <h2>🎧 Sistema de Chamados</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <Contador totalConcluidos={totalResolvidos} />
          <span className="user-badge" title={usuario?.email || ""}>
            👤 {nomeExibido}
          </span>
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                backgroundColor: "#dc2626",
                color: "#ffffff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.85rem",
                transition: "background 0.2s",
              }}
              title="Encerrar sessão"
            >
              🚪 Sair
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
