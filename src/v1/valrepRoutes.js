import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import valrepController from '../controllers/valrepController.js';

const router = express.Router();

router

    .get("/trade",valrepController.getTrade)
    .get("/coin/:ccompania", valrepController.getCoin)
    .post("/client", valrepController.getClient)
    .post("/brokers", valrepController.getBrokers)
    .post("/departament", valrepController.getDepartament)
    .post("/rol", valrepController.getRol)
    .post("/main-menu", valrepController.getMainMenu)
    .post("/menu", valrepController.getMenu)
    .post("/submenu", valrepController.getSubMenu)
    .post("/user", valrepController.getUser)
    .post("/park", valrepController.getPark)
    .post("/state", valrepController.getState)
    .post("/city", valrepController.getCity)
    .post("/brand", valrepController.getBrand)
    .post("/model", valrepController.getModel)
    .post("/version", valrepController.getVersion)
    .post("/color", valrepController.getColor)
    .post("/rates", valrepController.getRates)
    .post("/type-vehicle", valrepController.getTypeVehicle)
    .post("/utility-rechange", valrepController.getUtilityRechange)
    .post("/utility", valrepController.getUtility)
    .post("/class", valrepController.getClass)
    .post("/plan", valrepController.getPlan)
    .post("/accesories", valrepController.getAccesories)
    .post("/method-of-payment", valrepController.getMethodOfPayment)
    .post("/takers", valrepController.getTakers)
    .post("/type-of-payment", valrepController.getTypeOfPayment)
    .post("/bank",  valrepController.getBank)
    .post("/target-bank",  valrepController.getTargetBank)
    .post("/notification-type",  valrepController.getNotificationType)
    .post("/claim-cause",  valrepController.getClaimCause)
    .post("/tracing-type",  valrepController.getTracingType)
    .post("/tracing-motive",  valrepController.getTracingMotive)
    .get("/contracted-services/:ccontratoflota", valrepController.getContractedService)
    .post("/additional-services",  valrepController.getAdditionalServices)
    .post("/provider-service",  valrepController.getProviderService)
    .post("/status",  valrepController.getStatus)
    .post("/replacement-events",  valrepController.getReplacementEvents)
    .post("/provider",  valrepController.getProvider)
    
export default router;