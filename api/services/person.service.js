const fs = require('fs');


class PersonService {

    getPersonWithoutAddress(noaddress, order, age, startsWith) {

        try {
            const data = fs.readFileSync('./resources/persons.json', 'utf8');
            let persons = JSON.parse(data);

            if(noaddress) {
                const personsWithoutAddress = persons.filter(person =>!person.address);
                //cloned persons
                persons = personsWithoutAddress.map(persona => ({ ...persona }));

                if(order =='asc') {
                    persons = this.sortPersons(persons);
                }
            } 
            
            if(age) {
                const [minAge, maxAge] = age.split('-').map(Number);
                persons = persons.filter(person => person.age >= minAge && person.age <= maxAge);
                // Filtrar por nombres que empiecen con "H" o "L"
                if (startsWith) {
                    const validInitials = startsWith.split(',');
                    persons = persons.filter(person => {
                        const initial = person.name.charAt(0).toUpperCase();
                        return validInitials.includes(initial);
                    });
                }
            }

            return persons;
        } catch (error) {

            console.error('Error al leer el archivo:', error);
            throw error;
        }
    }

    sortPersons(persons) {
        // Algoritmo de ordenamiento por selección para ordenar por el campo 'name' en orden ascendente
        for (let i = 0; i < persons.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < persons.length; j++) {
                if (persons[j].name < persons[minIndex].name) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                const temp = persons[i];
                persons[i] = persons[minIndex];
                persons[minIndex] = temp;
            }
        }
    
        return persons;
    }



}

module.exports = new PersonService;