const fs = require('fs');
const validator = require('email-validator');

class EmailService {

    validateEmails(type) {

        try {
            const regexNotEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            const regexSinPersona = /^@[^.@]+\.[^.@]+$/;

            const data = fs.readFileSync('./resources/emails.json', 'utf8');
            let emails = JSON.parse(data);
            let message = null;
            if(type === 'validos') {
                emails = emails.filter(email => validator.validate(email));
            } else if(type === 'sinPersona') {
                emails =  emails.filter(email => !validator.validate(email) && regexSinPersona.test(email));
            } else if(type === 'noValidos'){
                emails = emails.filter(email => !regexNotEmail.test(email) && !regexSinPersona.test(email));
            } else {
                message = 'Tipo de validación no válido';
                console.error(message);
                return message ;
            }

            return emails;

        } catch (e) {
            console.error('Error al leer el archivo:', e);
            return;
        }

    }
}

module.exports = new EmailService