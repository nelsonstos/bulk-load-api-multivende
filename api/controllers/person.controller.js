const fs = require('fs');
const personService = require('../services/person.service');
const { StatusCodes } = require('http-status-codes');
const resp = require('../utils/response.utils');

class PersonController {
  
    async getPerson(req, res ) {

        const allowedParams = ['noaddress', 'order', 'age', 'startsWith'];
        const { noaddress, order, age, startsWith } = req.query;

        // Verificar si todos los parámetros están permitidos
        const isValidParams = Object.keys(req.query).every(param => allowedParams.includes(param));

        if (!isValidParams) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Parámetros no permitidos' });
        }

        try {  
            const persons = personService.getPersonWithoutAddress(noaddress, order, age, startsWith);
            const response = resp.response(StatusCodes.OK, {persons}, "filtered persons withouth address successfully!")
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            console.error('Error al obtener la persona:', error);
            throw error;
        }
        
    }
}

module.exports = PersonController;