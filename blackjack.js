// AP Computer Science Principles – Create Performance Task
// Lines 4-21; 51-97; 120-168 are structured by chatgpt

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
var deck, playerHand, dealerHand;
var gameOver = false;
var wins = 0;
var losses = 0;
var chipCount = 10;
var hasBet = false;

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit, img: `cards/${value}_of_${suit}.svg` });
        }
    }
    deck.sort(() => Math.random() - 0.5);
}

//algorithm
function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;

    hand.forEach(card => {
        if (['k', 'q', 'j'].includes(card.value)) {
            total += 10;
        } else if (card.value === 'a') {
            total += 11;
            aces += 1;
        } else {
            total += parseInt(card.value);
        }
    });

    const aceAdjustments = Math.min(aces, Math.ceil((total - 21) / 10));
    total -= aceAdjustments * 10;

    return total;
}


function dealCard(hand, elementId) {
    if (gameOver) return;

    const card = deck.pop();
    hand.push(card);

    const cardImg = document.createElement('img');
    cardImg.src = card.img;
    document.getElementById(elementId).appendChild(cardImg);

    if (hand === playerHand) {
        const playerValue = calculateHandValue(playerHand);
        console.log("Player total:", playerValue);

        if (playerValue > 21) {
            document.getElementById('message').innerText = "More than 21, busted!";
            gameOver = true;
            document.getElementById('hit').disabled = true;
            document.getElementById('stand').disabled = true;
            losses++
        } else if (playerValue === 21) {
            document.getElementById('message').innerText = "You got blackjack!";
            gameOver = true;
            document.getElementById('hit').disabled = true;
            document.getElementById('stand').disabled = true;
            wins++
        }
        updateScoreboard();
    }
}


function takeDealerTurn() {
    let dealerValue = calculateHandValue(dealerHand);
    console.log("Dealer starts at:", dealerValue);

    const interval = setInterval(() => {
        if (dealerValue < 17) {
            dealCard(dealerHand, 'dealer-cards');
            console.log("Dealer hand:", dealerHand);
            console.log("Player hand:", playerHand);
            dealerValue = calculateHandValue(dealerHand);
            console.log("Dealer hits:", dealerValue);
        } else {
            clearInterval(interval);

            const playerValue = calculateHandValue(playerHand);

            if (dealerValue > 21) {
                document.getElementById('message').innerText = "Dealer busts! You win!";
                wins++;
            } else if (dealerValue > playerValue) {
                document.getElementById('message').innerText = "Dealer wins.";
                losses++;
            } else if (dealerValue === playerValue) {
                document.getElementById('message').innerText = "Push, you tied.";
            } else {
                document.getElementById('message').innerText = "You win!";
                wins++;
            }
            updateScoreboard();

            gameOver = true;
            document.getElementById('hit').disabled = true;
            document.getElementById('stand').disabled = true;
        }
    }, 1000);
}

function updateScoreboard() {
    document.getElementById('wins').innerText = wins;
    document.getElementById('losses').innerText = losses;
}

function startGame() {
    deck = [];
    playerHand = [];
    dealerHand = [];
    gameOver = false;

    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('message').innerText = '';
    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;

    createDeck();
    dealCard(playerHand, 'player-cards');
    dealCard(dealerHand, 'dealer-cards');
    dealCard(playerHand, 'player-cards');

    const hiddenCard = document.createElement('img');
    hiddenCard.src = 'cards/back.png';
    hiddenCard.id = 'hidden-card';
    document.getElementById('dealer-cards').appendChild(hiddenCard);
}

document.getElementById('hit').addEventListener('click', () => dealCard(playerHand, 'player-cards'));
document.getElementById('stand').addEventListener('click', () => {
    // document.getElementById('message').innerText = "Dealer's Turn! (Logic not yet implemented)";
    if (gameOver) return;

    // Remove the back-of-card image
    const hiddenCard = document.getElementById('hidden-card');
    if (hiddenCard) hiddenCard.remove();

    // Flip the facedown card with a real card
    const card = deck.pop();
    dealerHand.push(card);
    const cardImg = document.createElement('img');
    cardImg.src = card.img;
    document.getElementById('dealer-cards').appendChild(cardImg);

    // Now let the dealer play
    takeDealerTurn();
});
document.getElementById('restart').addEventListener('click', startGame);
document.addEventListener('DOMContentLoaded', startGame);
