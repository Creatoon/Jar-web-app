const express = require('express');

const proposalController = require('./../controllers/proposalController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, proposalController.getAllProposals);

router
  .route('/:id')
  .get(authController.protect, proposalController.getOneProposal)
  .post(authController.protect, proposalController.createProposal)
  .delete(authController.protect, proposalController.deleteProposal);

module.exports = router;
