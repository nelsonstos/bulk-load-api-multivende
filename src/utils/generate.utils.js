const casual = require('casual');

class Generate {

    generateProductName() {
        const adjectives = ['Awesome', 'Great', 'Fantastic', 'Amazing', 'Superb', 'Excellent'];
        const nouns = ['Product', 'Item', 'Goods', 'Merchandise', 'Commodity'];
        const adjective = casual.random_element(adjectives);
        const noun = casual.random_element(nouns);
        return `${adjective} ${noun}`;
    }

}

module.exports = Generate;