var rs = require('readline-sync');

const alphaColumn = 'abcdefghij'.toUpperCase().split('');
let misses = [];
let hits = [];
let shipsCoords = [];
let gridArr = [];

// Build the game grid
const gridBuild = (size) => {
  for (let i = 0; i < size; i++) {
    gridArr[i] = [];
    for (let j = 0; j < size; j++) {
      gridArr[i].push(`${alphaColumn[i]}${j + 1}`);
    }
  }
  return gridArr;
};

// Check to see if the random ship coordinate is already in the shipsCoords array
const checkIfShipExistsInArr = (ship, shipsCoords) => {
  if (!shipsCoords.includes(ship)) {
    shipsCoords.push(ship);
    return true;
  } else {
    return randomShip();
  }
};

// Select a ship coordinate randomly from the grid

// After Andrey's review - it can be made "Dry" this way:
const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};
// console.log(getRandomNumber(3));
const randomShip = () => {
  const x = Math.floor(Math.random() * gridArr.length);
  const y = Math.floor(Math.random() * gridArr.length);
  // const [x, y] = [1, 2].forEach((_) => getRandomNumber(gridArr.length));
  let ship = gridArr[x][y];
  checkIfShipExistsInArr(ship, shipsCoords);
};

// Place both random ships in shipsCoords array
const setAllShips = () => {
  // [1, 2].forEach((item) => randomShip());
  [1, 2].forEach((_) => randomShip());
};

// Compare hits array elements to shipsCoords array elements
const compareCoords = (arr1, arr2) => {
  return (
    arr1.length === arr2.length &&
    arr1.every(function (element) {
      return arr2.includes(element);
    })
  );
};

// Assess user attack entry to see if it is a hit or miss and respond accordingly
const checkAttack = (attackCoord) => {
  if (shipsCoords.includes(attackCoord)) {
    if (hits.includes(attackCoord)) {
      console.log('You already fired on this position. Miss!');
    } else {
      hits.push(attackCoord);
      if (hits.length === 1) {
        console.log('Hit. You have sunk one battleship! One ship remains.');
      }
    }
  } else {
    if (misses.includes(attackCoord)) {
      console.log('You already fired on this position. Miss!');
    } else {
      misses.push(attackCoord);
      console.log('You have missed!');
    }
  }
};

// Collect the user's input for the user's attack, then call the checkAttack()
const attackProcess = () => {
  const attackShip = rs.question('Enter a location to strike.(I.e, "A2")');
  let attackCoord = attackShip.toUpperCase();
  checkAttack(attackCoord);
};

// Game flow
const gameOn = () => {
  var gameStart = rs.keyIn('Press any key to begin the game!');
  gridBuild(3);
  shipsCoords = [];
  misses = [];
  hits = [];
  setAllShips();
  while (!compareCoords(hits, shipsCoords)) {
    attackProcess();
  }
  var gameChoice = rs.keyInYNStrict(
    'You have destroyed all battleships.  Would you like to play again? Y/N'
  );
  if (gameChoice === false) {
    return false;
  } else {
    gameOn();
  }
};
gameOn();
