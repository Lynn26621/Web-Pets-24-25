const player = require("./player.js");

function addToInventory(item) {
    player.inventory.push(item);
};

function removeFromInventory(item) {
    const index = player.inventory.indexOf(item);
    if (index > -1) {
        player.inventory.splice(index, 1);
    };
};

function getInventory() {
    return player.inventory;
};

module.exports = {
    addToInventory,
    removeFromInventory,
    getInventory,
};