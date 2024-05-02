const prisma = require('../../config/prisma');

class LogbookRepository {

    async create( data) {

        return await prisma.logbook.create({data});

    }

    async find( data){
        return await prisma.logbook.findUnique({
            where: data
        });
    }

    async update( data) {
        return await prisma.logbook.update({
            where: data.where,
            data: data.data
        });
    }
}

module.exports = LogbookRepository;