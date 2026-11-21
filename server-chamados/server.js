// server.js - API REST com Autenticação e Proteção de Rotas (Supabase)
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("./supabase");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_padrao";

app.use(cors());
app.use(express.json());

// ============================================================================
// MIDDLEWARE DE AUTENTICAÇÃO (Validação de Token JWT)
// ============================================================================
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res
      .status(401)
      .json({ erro: "Acesso negado. Token não fornecido!" });
  }

  jwt.verify(token, JWT_SECRET, (err, usuarioDecodificado) => {
    if (err) {
      return res.status(403).json({ erro: "Token inválido ou expirado!" });
    }

    req.usuario = usuarioDecodificado;
    next();
  });
}

// ============================================================================
// ROTAS DE AUTENTICAÇÃO (PÚBLICAS)
// ============================================================================

// 1. Cadastrar novo usuário (POST /api/auth/cadastrar)
app.post("/api/auth/cadastrar", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "Nome, e-mail e senha são obrigatórios." });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nome, email, senha: senhaHash }])
      .select();

    if (error) {
      return res
        .status(400)
        .json({ erro: "E-mail já cadastrado ou erro ao salvar no banco." });
    }

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: { id: data[0].id, nome: data[0].nome, email: data[0].email },
    });
  } catch (err) {
    console.error("Erro interno no cadastro:", err);
    res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
  }
});

// 2. Login de usuário (POST /api/auth/login)
app.post("/api/auth/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  try {
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error("Erro interno no login:", err);
    res.status(500).json({ erro: "Erro interno ao processar login." });
  }
});

// ============================================================================
// ROTAS DE CHAMADOS
// ============================================================================

// 1. Listar todos os chamados (GET /api/chamados)
app.get("/api/chamados", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("chamados")
      .select("*")
      .order("id", { ascending: false });

    if (error) return res.status(500).json({ erro: error.message });
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao listar chamados:", err);
    res.status(500).json({ erro: "Erro ao carregar chamados." });
  }
});

// 2. Criar novo chamado (POST /api/chamados - Protegida)
app.post("/api/chamados", autenticarToken, async (req, res) => {
  const { titulo, descricao, prioridade } = req.body;

  if (!titulo || !descricao) {
    return res
      .status(400)
      .json({ erro: "Título e descrição são obrigatórios." });
  }

  const novoChamado = {
    titulo,
    descricao,
    prioridade: prioridade || "Baixa",
    status: "Aberto",
    data: new Date().toISOString().split("T")[0],
    usuario_id: req.usuario.id,
  };

  try {
    const { data, error } = await supabase
      .from("chamados")
      .insert([novoChamado])
      .select();

    if (error) return res.status(500).json({ erro: error.message });
    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Erro ao criar chamado:", err);
    res.status(500).json({ erro: "Erro ao criar chamado." });
  }
});

// 3. Atualizar status ou dados do chamado (PUT /api/chamados/:id - Protegida)
app.put("/api/chamados/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { status, titulo, descricao, prioridade } = req.body;

  const camposAtualizar = {};
  if (status !== undefined) camposAtualizar.status = status;
  if (titulo !== undefined) camposAtualizar.titulo = titulo;
  if (descricao !== undefined) camposAtualizar.descricao = descricao;
  if (prioridade !== undefined) camposAtualizar.prioridade = prioridade;

  if (Object.keys(camposAtualizar).length === 0) {
    return res
      .status(400)
      .json({ erro: "Informe ao menos um campo para atualização." });
  }

  try {
    const { data, error } = await supabase
      .from("chamados")
      .update(camposAtualizar)
      .eq("id", id)
      .select();

    if (error) return res.status(500).json({ erro: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ erro: "Chamado não encontrado." });
    }

    res.status(200).json({
      mensagem: "Chamado atualizado com sucesso!",
      chamado: data[0],
    });
  } catch (err) {
    console.error("Erro ao atualizar chamado:", err);
    res.status(500).json({ erro: "Erro ao atualizar chamado." });
  }
});

// 4. Excluir chamado (DELETE /api/chamados/:id - Protegida)
app.delete("/api/chamados/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from("chamados").delete().eq("id", id);

    if (error) return res.status(500).json({ erro: error.message });
    res.status(200).json({ mensagem: "Chamado excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir chamado:", err);
    res.status(500).json({ erro: "Erro ao excluir chamado." });
  }
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});
