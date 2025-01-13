function petHunger(pet) {
    petFullness = 100

    let timer = setInterval(() => {
        pet.hunger -= 1;
        if (pet.hunger <= 0) {
            clearInterval(timer);
        }
    }, 10000); //10 seconds

    return pet.hunger;
}

function petFeed(pet) {
    pet.hunger = 100;
    return pet.hunger;
}


module.exports = {
    petHunger,
    petFeed
};