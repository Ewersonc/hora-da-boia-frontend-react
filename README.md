# Hora da Boia — Frontend (Vite + React)

Interface web do sistema de reservas de mesas **Hora da Boia** (trabalho de Engenharia de Software de Ewerson Costa e Darlison Valdivino), feita com **Vite + React** e **React Router**. Consome a API do projeto `hora-da-boia-backend`.

## Como rodar (VS Code)

Pré-requisito: Node.js 18 ou mais novo.

1. Suba o backend (veja o README do `hora-da-boia-backend`). Ele deve estar em `http://localhost:8080`.
2. Abra esta pasta no VS Code, abra o terminal (Ctrl + `) e rode:

```bash
npm install
npm run dev
```

3. Acesse http://localhost:5500.

O Vite usa a porta **5500** (e não a 5173 padrão) porque ela já está liberada no CORS do backend. Se preferir outra porta, inclua-a em `CORS_ORIGENS` no backend.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com recarga automática |
| `npm run build` | Gera a versão de produção na pasta `dist/` |
| `npm run preview` | Serve a pasta `dist/` localmente para conferir o build |

## Configuração

O endereço da API vem da variável `VITE_API_URL`, definida no arquivo `.env` (modelo em `.env.example`):

```
VITE_API_URL=http://localhost:8080
```

Em produção, defina `VITE_API_URL` com o endereço público da API **antes** de rodar `npm run build` (o valor é gravado no build) e informe o endereço do front em `CORS_ORIGENS` no backend.

## Estrutura de pastas

```
src/
  main.jsx              ponto de entrada (Router + AuthProvider)
  App.jsx               tabela de rotas e perfis permitidos
  config/               env.js (API_URL) e menus.js (menu por perfil)
  contexts/             AuthContext (sessão do usuário)
  hooks/                useAuth, useAlerta
  routes/               RotaProtegida (exige sessão e perfil)
  services/             http.js (cliente HTTP + token JWT) e um serviço por assunto
                        (auth, disponibilidade, reservas, mesas, atendentes, configuracoes)
  utils/                datas.js, status.js, erros.js
  components/           Topo, Alerta, Modal, FichasHorario, SeloStatus
    reservas/           CartaoReserva e modais de alterar/cancelar
    mesas/              ModalMesa
    atendentes/         ModalAtendente
  pages/                uma página por tela
  styles/estilo.css     estilos globais
```

## Rotas e perfis

| Rota | Página | Perfis |
| --- | --- | --- |
| `/` | Login e cadastro | público |
| `/reservar`, `/minhas-reservas` | Cliente | CLIENTE |
| `/agenda`, `/balcao` | Equipe | ATENDENTE, ADMINISTRADOR |
| `/mesas`, `/configuracoes`, `/atendentes`, `/historico` | Administração | ADMINISTRADOR |

Quem não tem sessão, ou não tem o perfil da rota, volta para `/`. Quando a API responde 401, a sessão é encerrada automaticamente.

## Hospedagem

`npm run build` gera arquivos estáticos em `dist/`, que podem ser publicados em qualquer hospedagem estática (Netlify, Vercel, Cloudflare Pages, GitHub Pages ou Nginx). Como o app usa rotas do React Router, configure a hospedagem para devolver o `index.html` em qualquer caminho (por exemplo, `try_files $uri /index.html;` no Nginx).
