let inventory = [];

function display() {
    if (inventory.length > 0) {
        inventory.forEach((item) => {
            itemList.innerHTML += "<ul>" + item + "</ul>";
        });
    } else {
        itemList.innerHTML = "<p>Your have no items.</p>";
    };
};

function search(inventory) {
    const searchTerm = inventory.target.value.trim().toLowerCase();
    inventory.forEach((item) => {
        if (!items.innerText.includes(searchTerm)) {
            item.style.display = false;
        } else {
            item.style.display = true;
        };
    });
};

function filter(inventory) {
    inventory.forEach((item) => {
        if (item.classList.contains(inventory.target.value)) {
            item.style.display = true;
        } else {
            item.style.display = false;
        };
    });
};

module.exports = {
    display,
    search,
    filter,
};