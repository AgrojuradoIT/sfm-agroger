// src/controllers/FincaController.js
import { getFincas } from "../models/FincaModel";

export const fetchFincas = () => {
  return getFincas();
};