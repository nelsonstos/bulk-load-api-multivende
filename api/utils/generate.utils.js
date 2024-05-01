const casual= require('casual');

class Generate {

    generateProductName() {
        const adjectives = ['Smart', 'Digital', 'Wireless', 'Virtual', 'Augmented', 'Intelligent', 'Automated',
        'Innovative', 'Interactive', 'High-Tech', 'Advanced', 'Efficient', 'Sleek', 'Eco-Friendly', 'Compact',
        'Portable', 'Powerful', 'User-Friendly', 'Futuristic', 'Modern', 'Cutting-Edge', 'Robust', 'Versatile',
        'Sophisticated', 'Seamless', 'Streamlined', 'Connected', 'Precise', 'Reliable', 'Secure', 'Responsive',
        'Dynamic', 'Effortless', 'Ingenious', 'Revolutionary', 'Precision', 'Agile', 'Optimized', 'Integrated',
        'Innovative', 'Efficient', 'Ergonomic', 'Stylish', 'Disruptive', 'Discreet', 'Innovative', 'Seamless',
        'Powerful', 'Sleek', 'Intuitive', 'Elegant', 'Effortless', 'Ingenious', 'Versatile', 'Dynamic', 'Compact',
        'Advanced', 'High-Performance', 'Cutting-Edge', 'Futuristic', 'Secure', 'Reliable', 'Adaptable', 'Efficient',
        'Streamlined', 'Connected', 'Robust', 'Responsive', 'Versatile', 'Smart', 'Intelligent', 'Innovative',
        'User-Friendly', 'Modern', 'Dynamic', 'Sleek', 'Efficient', 'Compact', 'Ergonomic', 'Stylish', 'Advanced',
        'High-Tech', 'Futuristic', 'Intuitive', 'Seamless', 'Ingenious', 'Precise', 'Reliable', 'Powerful',
        'Disruptive', 'Streamlined', 'Versatile', 'Secure', 'Responsive', 'Cutting-Edge', 'Dynamic', 'Efficient',
        'User-Friendly', 'Innovative', 'Modern', 'Robust', 'Sleek', 'Smart', 'Compact', 'Ergonomic', 'Advanced',
        'Seamless', 'Futuristic', 'Reliable', 'Precise', 'Streamlined', 'Versatile', 'High-Tech', 'Efficient',
        'Intelligent', 'Ingenious', 'Interactive', 'Responsive', 'Effortless', 'Innovative', 'Powerful', 'Sleek',
        'Dynamic', 'Secure', 'Agile', 'Cutting-Edge', 'Modern', 'User-Friendly', 'Compact', 'Intuitive', 'Robust',
        'Reliable', 'Advanced', 'Futuristic', 'Streamlined', 'Versatile', 'Efficient', 'Precise', 'Seamless',
        'Innovative', 'Dynamic', 'Sleek', 'Responsive', 'Smart', 'Cutting-Edge', 'Effortless', 'Reliable',
        'Intelligent', 'Streamlined', 'Compact', 'Innovative', 'Modern', 'Robust', 'User-Friendly', 'Futuristic',
        'Sleek', 'Dynamic', 'Efficient', 'Powerful', 'Versatile', 'Responsive', 'Precise', 'Seamless', 'Agile'];

    const nouns = ['Device', 'Gadget', 'Appliance', 'Tool', 'Equipment', 'Widget', 'App', 'System', 'Solution',
        'Platform', 'Service', 'Machine', 'Robot', 'Software', 'Hardware', 'Interface', 'Network', 'Apparatus',
        'Applicator', 'Technique', 'Invention', 'Contraption', 'Creation', 'Innovation', 'Implement', 'Contrivance',
        'Setup', 'Contrivance', 'Contraption', 'Instrument', 'Mechanism', 'Apparatus', 'Fixture', 'Gizmo', 'Thingamajig',
        'Thingamabob', 'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Contrivance', 'Apparatus', 'Contraption', 'Setup',
        'Contrivance', 'Contraption', 'Tool', 'Implement', 'Instrument', 'Gizmo', 'Thingamajig', 'Thingamabob',
        'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Contrivance', 'Apparatus', 'Fixture', 'Device', 'Machine', 'Appliance',
        'Instrument', 'Gadget', 'Apparatus', 'Contraption', 'Contrivance', 'Implement', 'Setup', 'Thingamajig',
        'Thingamabob', 'Gizmo', 'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Apparatus', 'Contraption', 'Setup', 'Contrivance',
        'Tool', 'Apparatus', 'Fixture', 'Thingamajig', 'Thingamabob', 'Doodad', 'Doohickey', 'Gimmick', 'Rig',
        'Contrivance', 'Apparatus', 'Fixture', 'Device', 'Machine', 'Appliance', 'Instrument', 'Gadget', 'Apparatus',
        'Contraption', 'Contrivance', 'Implement', 'Setup', 'Thingamajig', 'Thingamabob', 'Gizmo', 'Doodad',
        'Doohickey', 'Gimmick', 'Rig', 'Contrivance', 'Apparatus', 'Fixture', 'Thingamajig', 'Thingamabob',
        'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Apparatus', 'Contraption', 'Setup', 'Contrivance', 'Tool',
        'Apparatus', 'Fixture', 'Thingamajig', 'Thingamabob', 'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Contrivance',
        'Apparatus', 'Fixture', 'Device', 'Machine', 'Appliance', 'Instrument', 'Gadget', 'Apparatus', 'Contraption',
        'Contrivance', 'Implement', 'Setup', 'Thingamajig', 'Thingamabob', 'Gizmo', 'Doodad', 'Doohickey', 'Gimmick',
        'Rig', 'Contrivance', 'Apparatus', 'Fixture', 'Thingamajig', 'Thingamabob', 'Doodad', 'Doohickey', 'Gimmick',
        'Rig', 'Apparatus', 'Contraption', 'Setup', 'Contrivance', 'Tool', 'Apparatus', 'Fixture', 'Thingamajig',
        'Thingamabob', 'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Contrivance', 'Apparatus', 'Fixture', 'Device',
        'Machine', 'Appliance', 'Instrument', 'Gadget', 'Apparatus', 'Contraption', 'Contrivance', 'Implement',
        'Setup', 'Thingamajig', 'Thingamabob', 'Gizmo', 'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Contrivance',
        'Apparatus', 'Fixture', 'Thingamajig', 'Thingamabob', 'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Apparatus',
        'Contraption', 'Setup', 'Contrivance', 'Tool', 'Apparatus', 'Fixture', 'Thingamajig', 'Thingamabob',
        'Doodad', 'Doohickey', 'Gimmick', 'Rig', 'Contrivance', 'Apparatus', 'Fixture'];
        const uniqueId = Math.floor(Math.random() * 1000); // Agregar un ID único para evitar repeticiones
        const adjective = casual.random_element(adjectives);
        const noun = casual.random_element(nouns);
        return `${adjective} ${noun} ${uniqueId} `;
    }

}

module.exports = Generate;