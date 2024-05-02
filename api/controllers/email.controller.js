const fs = require('fs');
const personService = require('../services/person.service');
const { StatusCodes } = require('http-status-codes');
const resp = require('../utils/response.utils');
const emailService = require('../services/email.service');

class EmailController {
  
    async getEmails(req, res ) {
        const allowedTypes = ['validos', 'sinPersona', 'noValidos'];
        const { type } = req.query;
        // Verificar si el tipo es permitido
        if (!allowedTypes.includes(type)) {
       
            return res.status(StatusCodes.BAD_GATEWAY).json({ error: 'Typo no permitido' });
        }
        try {  
            const emails = emailService.validateEmails(type);
            if (typeof emails === 'string') {
                const response = resp.response(StatusCodes.BAD_REQUEST, {}, emails)
                res.status(StatusCodes.BAD_REQUEST).json(response);
                return;
            }
            const response = resp.response(StatusCodes.OK, {emails}, "Emails successfully filtered!")
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            console.error('Error al obtener la persona:', error);
            throw error;
        }
        
    }
}

module.exports = EmailController;