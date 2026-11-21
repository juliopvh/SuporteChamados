// src/App.jsx - Sistema de Chamados integrado ao Supabase
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import ResumoMetricas from "./components/ResumoMetricas";
import FormularioChamado from "./components/FormularioChamado";
import FiltroChamados from "./components/FiltroChamados";
import ChamadoCard from "./components/ChamadoCard";
import Login from "./components/Login";
import { API_BASE_URL } from "./config/api";
import "./App.css";

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem("usuario_chamados");
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token_chamados") || ""
  );
  const [chamados, setChamados] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(() => Boolean(usuario));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogout = useCallback((mensagem) => {
    localStorage.removeItem("usuario_chamados");
    localStorage.removeItem("token_chamados");
    setUsuario(null);
    setToken("");
    setChamados([]);
    if (mensagem && typeof mensagem === "string") {
      alert(mensagem);
    }
  }, []);

  const carregarChamados = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chamados`);
      if (!res.ok) {
        throw new Error("Não foi possível carregar os chamados.");
      }

      const respostaJson = await res.json();
      const lista = Array.isArray(respostaJson)
        ? respostaJson
        : respostaJson.dados || [];

      setChamados(lista);
      setErro("");
    } catch (err) {
      console.error("Erro ao carregar chamados:", err);
      setErro("Falha ao sincronizar com o banco de dados Supabase.");
      setChamados([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    if (usuario) {
      fetch(`${API_BASE_URL}/api/chamados`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao carregar");
          return res.json();
        })
        .then((respostaJson) => {
          if (!ativo) return;
          const lista = Array.isArray(respostaJson)
            ? respostaJson
            : respostaJson.dados || [];
          setChamados(lista);
          setErro("");
          setCarregando(false);
        })
        .catch((err) => {
          if (!ativo) return;
          console.error("Erro ao carregar chamados:", err);
          setErro("Falha ao sincronizar com o banco de dados Supabase.");
          setChamados([]);
          setCarregando(false);
        });
    }

    return () => {
      ativo = false;
    };
  }, [usuario]);

  function handleLoginSucesso(usuarioLogado, tokenGerado) {
    setUsuario(usuarioLogado);
    setToken(tokenGerado);
    setCarregando(true);
  }

  async function adicionarChamado(novoChamado) {
    setSalvando(true);
    setErro("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/chamados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoChamado),
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout("Sua sessão expirou. Faça login novamente.");
        return;
      }

      if (!res.ok) {
        const dadosErro = await res.json().catch(() => ({}));
        throw new Error(dadosErro.erro || "Erro ao salvar chamado.");
      }

      await carregarChamados();
    } catch (err) {
      console.error("Erro ao adicionar chamado:", err);
      alert(err.message || "Falha ao cadastrar chamado.");
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatusChamado(id, statusAtual) {
    let proximoStatus = "Em Andamento";
    const statusNormalizado = (statusAtual || "").toLowerCase();

    if (statusNormalizado === "aberto") {
      proximoStatus = "Em Andamento";
    } else if (statusNormalizado === "em andamento") {
      proximoStatus = "Concluído";
    } else {
      proximoStatus = "Aberto";
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/chamados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: proximoStatus }),
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout("Sua sessão expirou. Faça login novamente.");
        return;
      }

      if (!res.ok) {
        const dadosErro = await res.json().catch(() => ({}));
        throw new Error(dadosErro.erro || "Erro ao atualizar status.");
      }

      await carregarChamados();
    } catch (err) {
      console.error("Erro ao alternar status:", err);
      alert(err.message || "Falha ao atualizar status do chamado.");
    }
  }

  async function removerChamado(id) {
    if (!window.confirm("Tem certeza de que deseja remover este chamado?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/chamados/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout("Sua sessão expirou. Faça login novamente.");
        return;
      }

      if (!res.ok) {
        const dadosErro = await res.json().catch(() => ({}));
        throw new Error(dadosErro.erro || "Erro ao excluir chamado.");
      }

      await carregarChamados();
    } catch (err) {
      console.error("Erro ao remover chamado:", err);
      alert(err.message || "Falha ao excluir chamado.");
    }
  }

  // Se não estiver autenticado, exibe a tela de login
  if (!usuario) {
    return <Login onLoginSucesso={handleLoginSucesso} />;
  }

  const concluidosCount = chamados.filter((c) => {
    const s = (c.status || "").toLowerCase();
    return s === "concluído" || s === "concluido";
  }).length;

  const chamadosFiltrados = chamados.filter((c) =>
    (c.titulo || "").toLowerCase().includes(busca.toLowerCase()) ||
    (c.descricao || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="app-container">
      <Header
        usuario={usuario}
        totalResolvidos={concluidosCount}
        onLogout={() => handleLogout()}
      />

      <main className="main-content">
        {erro && (
          <div className="alerta-erro">
            <span>⚠️ {erro}</span>
            <button
              onClick={() => {
                setCarregando(true);
                carregarChamados();
              }}
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Tentar Novamente
            </button>
          </div>
        )}

        <ResumoMetricas chamados={chamados} />

        <FormularioChamado
          onAdicionarChamado={adicionarChamado}
          salvando={salvando}
        />

        <div className="top-bar">
          <h2>Chamados ({chamadosFiltrados.length})</h2>
          <FiltroChamados busca={busca} setBusca={setBusca} />
        </div>

        {carregando && chamados.length === 0 ? (
          <div className="aviso-carregando">
            <p>⏳ Carregando chamados do Supabase...</p>
          </div>
        ) : (
          <section className="lista-chamados">
            {chamadosFiltrados.length > 0 ? (
              chamadosFiltrados.map((chamado) => (
                <ChamadoCard
                  key={chamado.id}
                  id={chamado.id}
                  titulo={chamado.titulo}
                  descricao={chamado.descricao}
                  prioridade={chamado.prioridade}
                  status={chamado.status}
                  data={chamado.data}
                  onAlternarStatus={() =>
                    alternarStatusChamado(chamado.id, chamado.status)
                  }
                  onRemover={() => removerChamado(chamado.id)}
                />
              ))
            ) : (
              <div className="sem-chamados">
                <p>Nenhum chamado encontrado {busca ? `para "${busca}"` : ""}.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
