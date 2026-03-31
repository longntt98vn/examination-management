const express = require("express");
const candidateRouter = express.Router();
const candidateMiddleware = require("../middleware/candidate-middleware/candidate");
candidateRouter.post(
  "/api/candidate/register",
  candidateMiddleware.registerCandidate,
);
candidateRouter.get("/api/candidate/:id", candidateMiddleware.getCandidate);
candidateRouter.put("/api/candidate/:id", candidateMiddleware.updateCandidate);
candidateRouter.get("/api/candidates", candidateMiddleware.getAllCandidates);

module.exports = { candidateRouter };
