import express from 'express';

import maestrosController from '../../src/controllers/maestrosController.js';

const router = express.Router();

router
    .get("/monedas", maestrosController.getMaMonedas)
    .get("/getCuentasMaestros", maestrosController.getCuentasMaestros)
    .get("/moneda/:id", maestrosController.getMoneda)
    .get("/companias", maestrosController.getMaCompanias)
    .get("/estatuses", maestrosController.getMaEstatuses)
    .get("/compania/:id", maestrosController.getMaCompania)
    .get("/paises", maestrosController.getMaPaises)
    .get("/bancos", maestrosController.getMaBancos)
    .get("/proveedores", maestrosController.getMaProveedores)
    .get("/estadocivil", maestrosController.getMaEstadocivil)
    .get("/vehiculos", maestrosController.getMaVehiculos)
    .get("/marcas", maestrosController.getMaMarcas)
    .get("/tipodocidentidad", maestrosController.getMaTipodocidentidad)
    .get("/propietarios", maestrosController.getMaPropietarios)
    .get("/parentescos", maestrosController.getMaParentescos)
    .get("/estatus", maestrosController.getMaEstatus)
    .get("/metPago", maestrosController.getMaMetsPago)
    .get("/servicios", maestrosController.getServicios)
    .get("/aseguradoras", maestrosController.getAseguradoras)
    .get("/ciudades/:estado", maestrosController.getMaCiudades)
    .get("/estados/:pais", maestrosController.getMaEstados)
    .post("/replacement", maestrosController.getMaRepuestos)
    
export default router;