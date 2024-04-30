class Product {
    constructor(name, alias, model, description, code, internalCode, shortDescription, htmlDescription, htmlShortDescription) {
        this.name = name;
        this.alias = alias;
        this.model = model;
        this.description = description;
        this.code = code;
        this.internalCode = internalCode;
        this.shortDescription = shortDescription;
        this.htmlDescription = htmlDescription;
        this.htmlShortDescription = htmlShortDescription;
    }
}

module.exports = Product;