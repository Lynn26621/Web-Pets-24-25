export function displayInventory(player) {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = ''; //clear the list before displaying
    if (player.inventory.length > 0) {
        player.inventory.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            itemList.appendChild(listItem);
        });
    } else {
        const noItemsMessage = document.createElement("p");
        noItemsMessage.textContent = "You have no items.";
        itemList.appendChild(noItemsMessage);
    };
};

export function searchInventory(player, searchTerm) {
    const results = player.inventory.filter((item) => item.toLowerCase().includes(searchTerm));
    return results;
};

export function filterInventory(player) {
    if (dropOpt.checked) {
        player.inventory.forEach((item) => {
            if (item.classList.contains(player.inventory.target.value)) {
                item.style.display = true;
            } else {
                item.style.display = false;
            };
        });
    };
};