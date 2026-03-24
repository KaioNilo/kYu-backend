"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const rateLimitMiddleware_1 = require("./middleware/rateLimitMiddleware");
const errorHandlerMiddleware_1 = require("./middleware/errorHandlerMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Middlewares Globais
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Rotas
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.get('/', (req, res) => {
    res.send('API K&U rodando com CORS configurado!');
});
// Rota de orçamentos com Rate Limit
app.use('/api/orcamentos', rateLimitMiddleware_1.leadLimiter, orderRoutes_1.default); //
// Conexão BD
const mongoURL = process.env.MONGODB_URL;
mongoose_1.default.connect(mongoURL)
    .then(() => console.log('✅ MongoDB conectado com sucesso!')) //
    .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));
app.use(errorHandlerMiddleware_1.errorHandler); //
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
