// Agentes (empresas e bancos)
import { api } from "../api/api-client.js";

export const listar = () => api.listar("agentes");
