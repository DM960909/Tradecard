

    const pokeFacts = [
        "Pokémon Red and Green, the original Pokémon games, were released in Japan on February 27, 1996.",
        "The Pokémon franchise was created by Satoshi Tajiri and Ken Sugimori.",
        "The Pokémon Pikachu Illustrator card is one of the rarest Pokémon cards ever produced, with only 39 copies in existence.",
        "The first Pokémon trading card game (TCG) set was released in Japan in 1996 and internationally in 1999.",
        "The Pokémon TCG has thousands of different cards, including Pokémon, Trainer, and Energy cards.",
        "The most valuable Pokémon card ever sold is a Pikachu Illustrator card, which fetched over $200,000 in a private sale.",
        "The Pokémon Charizard card from the Base Set is one of the most iconic and sought-after cards in the TCG.",
        "The Pokémon Company International hosts an annual World Championships event for the Pokémon TCG.",
        "The Pokémon franchise has expanded beyond video games and trading cards to include an animated TV series, movies, toys, and more.",
        "Pokémon has become one of the highest-grossing media franchises of all time, with billions of dollars in revenue worldwide."
    ];

    function getRandomPokemonFact() {
        const randomIndex = Math.floor(Math.random() * pokeFacts.length);
        const randomFact = pokeFacts[randomIndex];

        document.getElementById("pokeFact").textContent = randomFact;
    }
    