# Estimador de Obra
**Rafael Rodrigues — Engenheiro Civil | Especialista em Gerenciamento de Obras**

Ferramenta de estimativa paramétrica de obras residenciais.  
CUB · NBR 12721 · SINAPI · TCPO 13ª ed.

---

## 🚀 Deploy no Vercel (passo a passo)

### Pré-requisitos
- Conta gratuita no [GitHub](https://github.com) (para guardar o código)
- Conta gratuita no [Vercel](https://vercel.com) (para hospedar o site)

---

### Passo 1 — Criar repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"** (botão verde no canto superior direito)
3. Nome: `estimador-obra`
4. Deixe **Private** se quiser privado, ou **Public** para compartilhar
5. **NÃO** marque "Add a README file" (já temos)
6. Clique em **"Create repository"**

---

### Passo 2 — Subir os arquivos

Após criar o repositório, o GitHub mostra instruções. Use uma destas opções:

**Opção A — Interface web (mais fácil, sem instalar nada):**
1. Na página do repositório vazio, clique em **"uploading an existing file"**
2. Arraste **toda a pasta `estimador-obra`** para a área de upload
3. Clique em **"Commit changes"**

**Opção B — Terminal (se tiver Git instalado):**
```bash
cd estimador-obra
git init
git add .
git commit -m "Estimador de obra v1.0"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/estimador-obra.git
git push -u origin main
```

---

### Passo 3 — Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório **`estimador-obra`**
4. O Vercel detecta automaticamente que é um projeto Vite
5. **Não precisa alterar nada** — clique em **"Deploy"**
6. Aguarde ~1 minuto

✅ Pronto! Você receberá uma URL como:
```
https://estimador-obra-rafael.vercel.app
```

---

### Passo 4 — Domínio personalizado (opcional)

Se quiser um domínio próprio (ex: `estimador.rafaelrodrigues.eng.br`):
1. No painel do Vercel, acesse **Settings → Domains**
2. Adicione seu domínio
3. Configure o DNS conforme instruções do Vercel

---

## 🔄 Atualizações futuras

Toda vez que você atualizar o código e fazer **push para o GitHub**, o Vercel **redeploy automaticamente**. Zero trabalho manual.

---

## 📁 Estrutura do projeto

```
estimador-obra/
├── index.html          # Página principal
├── vite.config.js      # Configuração do Vite
├── package.json        # Dependências
├── vercel.json         # Configuração do Vercel (SPA routing)
├── .gitignore
├── README.md
└── src/
    ├── main.jsx        # Ponto de entrada React
    ├── App.jsx         # Aplicativo principal (todo o estimador)
    └── storage.js      # Adaptador localStorage (substituiu window.storage)
```

---

## 💻 Rodar localmente (desenvolvimento)

```bash
# Instalar dependências (só na primeira vez)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
# → Abre em http://localhost:5173

# Build para produção
npm run build
```

---

## ⚙️ Tecnologias

- **React 18** + **Vite 5** — interface e build
- **localStorage** — persistência de dados (obras salvas, CUB customizado)
- **NBR 12721 / CUB** — base de custo por estado
- **SINAPI / TCPO 13ª ed.** — índices unitários de composição
- **PDF** — geração via `window.open` + `window.print()`

---

## 📋 Funcionalidades

- ✅ Modo CUB (estimativa rápida) e Modo Detalhado (índices unitários)
- ✅ 26 estados · CUB R1-B, R1-N, R1-A atualizados
- ✅ Ambientes com dimensões reais (C × L × Pé Direito)
- ✅ Estrutura parametrizada automaticamente pela área
- ✅ Guia de compras de materiais por etapa
- ✅ 15 etapas de obra com composições SINAPI/TCPO
- ✅ Itens por projeto (elétrica, hidráulica, esquadrias, louças)
- ✅ BDI configurável (Obra Própria ou Venda)
- ✅ Exportação em PDF com memória de cálculo
- ✅ Salvar/carregar múltiplas obras (localStorage)
- ✅ Painel de atualização do CUB mensal
- ✅ Alertas e validações técnicas
- ✅ Comparativo entre todos os estados

---

## 📞 Desenvolvedor

**Rafael Rodrigues**  
Engenheiro Civil — Especialista em Gerenciamento de Obras  

---

*Estimativa paramétrica. Não substitui orçamento discriminado com projeto executivo.*
