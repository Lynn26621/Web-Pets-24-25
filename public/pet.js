let pet1 = {
    hunger: 50,
    happiness: 50
};

function petHunger(pet) {
    console.log("hunger function");

    let timer = setInterval(() => {
        pet.hunger -= 1;
        if (pet.hunger <= 0) {
            clearInterval(timer);
        }
    }, 10000); //10 seconds

    return pet.hunger;
}

function petFeed() {
    console.log("feed function");
    //Don't allow feeding if pet is too full
    if (pet1.hunger > 80) {
        actLog.innerHTML += "<p>Your pet is too full to eat right now.</p>";
        return;
    }
    else if (pet1.hunger <= 80) {
        actLog.innerHTML += "<p>You fed your pet.</p>";
        // update the pet hunger stat in the database
        db.run(`UPDATE pets SET hunger = hunger + 20 WHERE id = ${pet1.id}`)
        // update the hungerStat display number
        hungerStat.innerHTML = `<p>Hunger: ${pet1.hunger + 20}</p>`;
    }
}

function petPlay() {
    console.log("play function");
    // update the pet happiness stat in the database
    if (pet1.happiness > 80) {
        actLog.innerHTML += "<p>You play with your pet.</p>";
        db.run(`UPDATE pets SET happiness = 100 WHERE id = ${pet1.id}`)
    }
    else if (pet1.happiness <= 80) {
        actLog.innerHTML += "<p>You play with your pet.</p>";
        db.run(`UPDATE pets SET happiness = happiness + 20 WHERE id = ${pet1.id}`)
    }
    // update the happinessStat display number
    happinessStat.innerHTML = `<p>Happiness: ${pet1.happiness}</p>`;
}

module.exports = {
    pet1,
    petHunger,
    petFeed,
    petPlay
}