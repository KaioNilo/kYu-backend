⚙️ Kyu API (Backend)
Descrição
Servidor Node.js responsável pelo processamento de formulários, automação de cálculos (como frete) e armazenamento de leads.

🛠️ Tecnologias
Node.js: Ambiente de execução.

Express: Framework para rotas e middlewares.

Axios: Integração com APIs externas (Shipping/Mail).

CORS: Configurado para permitir comunicações seguras com o domínio da Vercel.

🔌 Endpoints Principais
POST /leads: Captura e validação de dados do formulário de contato.

GET /shipping: Cálculo automatizado de frete integrando APIs de logística.

