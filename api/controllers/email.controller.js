const fs = require('fs');
const personService = require('../services/person.service');
const { StatusCodes } = require('http-status-codes');
const resp = require('../utils/response.utils');
const emailService = require('../services/email.service');

class EmailController {
  
    async getEmails(req, res ) {

        const { type } = req.query;

        try {  
            const emails = emailService.validateEmails(type);
            const response = resp.response(StatusCodes.OK, {emails}, "Emails successfully filtered!")
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            console.error('Error al obtener la persona:', error);
            throw error;
        }
        
    }
}

module.exports = EmailController;