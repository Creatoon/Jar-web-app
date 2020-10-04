const Proposal = require('../models/proposalModel');
const factory = require('./../controllers/handlerFactory');

exports.getAllProposals = factory.getAll(Proposal);
exports.getOneProposal = factory.getOne(Proposal);
exports.deleteProposal = factory.deleteOne(Proposal);
exports.createProposal = factory.createOne(Proposal);
