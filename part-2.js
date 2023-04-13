var rs = require('readline-sync');

const alphaColumn = 'abcdefghij'.toUpperCase().split('');
let misses = [];
let hits = [];
let allShips = [];
let gridArr = [];
let carrierArr = [];
let carrierHitsArr = [];
let battleShipArr = [];
let battleShipHitsArr = [];
let cruiser1Arr = [];
let cruiser1HitsArr = [];
let cruiser2Arr = [];
let cruiser2HitsArr = [];
let destroyerArr = [];
let destroyerHitsArr = [];
let coord;

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
gridBuild(10);

// Check to see if the random ship coordinate is already in the shipsCoords array
const checkIfShipOverlapsArr = (allShips, shipArr) => {
  const flatArr = allShips.flat();
  return shipArr.some((coord) => flatArr.includes(coord));
};

//Determine if the ship will be horizontal or vertical by randomly choosing a 0 or 1
// "0" = horizontal   "1" = vertical
const direction = () => Math.round(Math.random());

// Select a ship coordinate randomly from the grid

// After Andrey's review - it can be made "Dry" this way:
const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const randomBlock = () => {
  // const x = Math.floor(Math.random() * gridArr.length);
  // const y = Math.floor(Math.random() * gridArr.length);
  const [x, y] = [1, 2].forEach((_) => getRandomNumber(gridArr.length));
  coord = gridArr[x][y];
  return coord;
};

const recallPlaceShip = (allShips, shipArr, num, shipPlaceAngle) => {
  const newArr = allShips;
  if (checkIfShipOverlapsArr(allShips, shipArr)) {
    return shipPlaceAngle(shipArr, num);
  } else {
    newArr.push(shipArr);
    return newArr;
  }
};
// Horizontal ship placement:
const placeShipHoriz = (shipArr, num) => {
  randomBlock();
  shipArr = [];
  if (+coord[1] + (num - 1) <= alphaColumn.length) {
    for (let i = +coord[1]; i < +coord[1] + num; i++) {
      shipArr.push([coord[0], i].join(''));
    }
  } else {
    return placeShipHoriz(shipArr, num);
  }
  recallPlaceShip(allShips, shipArr, num, placeShipHoriz);

  return true;
};

// Vertical ship placement:
const placeShipVert = (shipArr, num) => {
  randomBlock();
  shipArr = [];
  const alphaIndex = alphaColumn.indexOf(coord[0]);

  if (alphaIndex + (num - 1) < alphaColumn.length) {
    for (let i = alphaIndex; i < alphaIndex + num; i++) {
      shipArr.push([alphaColumn[i], coord[1]].join(''));
    }
  } else {
    return placeShipVert(shipArr, num);
  }

  if (checkIfShipOverlapsArr(allShips, shipArr)) {
    return placeShipVert(shipArr, num);
  } else {
    allShips.push(shipArr);
  }
  return true;
};

// function that takes a random direction and places a ship's position on the grid
const placeShipOnGrid = (shipArr, num) => {
  direction();
  if (direction() === 0) {
    placeShipHoriz(shipArr, num);
  } else {
    placeShipVert(shipArr, num);
  }
  return true;
};

// Sets all ships for game and sets ship arrays for attack assessment
const setAllShips = () => {
  placeShipOnGrid(carrierArr, 5);
  placeShipOnGrid(battleShipArr, 4);
  placeShipOnGrid(cruiser1Arr, 3);
  placeShipOnGrid(cruiser2Arr, 3);
  placeShipOnGrid(destroyerArr, 2);
  carrierArr = allShips[0];
  battleShipArr = allShips[1];
  cruiser1Arr = allShips[2];
  cruiser2Arr = allShips[3];
  destroyerArr = allShips[4];
  return allShips;
};

// Compare hits array elements to allShips array elements for game to continue or end
const compareCoords = (arr1, arr2) => {
  return (
    arr1.length === arr2.length &&
    arr1.every(function (element) {
      return arr2.includes(element);
    })
  );
};

// After a ship is sunk, this tells user which ships are remaining in the game
const remainingShips = () => {
  if (carrierHitsArr.length < 5) {
    console.log('You have a carrier remaining.');
  }
  if (battleShipHitsArr.length < 4) {
    console.log('You have a battleship remaining.');
  }
  if (cruiser1HitsArr.length < 3 && cruiser2HitsArr.length < 3) {
    console.log('You have two cruisers remaining.');
  } else if (cruiser1HitsArr.length < 3 || cruiser2HitsArr.length < 3) {
    console.log('You have a cruiser remaining.');
  }
  if (destroyerHitsArr.length < 2) {
    console.log('You have a destroyer remaining.');
  }
};

// Determines when a ship is hit, sunk, and calls the remainingShips function
const attackResponse = (arr1, arr2, arr3, ship, attackCoord) => {
  let shipName = ship;
  const checker = (arr, target) => target.every((v) => arr.includes(v));
  arr3.push(attackCoord);
  if (checker(arr1, arr2)) {
    console.log(`Hit. You have sunk a ${shipName}!`);
    remainingShips();
  } else {
    console.log('Hit!');
  }
};

// Assess user attack entry to see if it is a hit or miss, compare to each ship's array if it is a hit and respond accordingly
const checkAttack = (attackCoord) => {
  if (allShips.flat().includes(attackCoord)) {
    if (hits.includes(attackCoord)) {
      console.log('You already fired on this position. Miss!');
    } else {
      hits.push(attackCoord);
      if (carrierArr.includes(attackCoord)) {
        attackResponse(
          hits,
          carrierArr,
          carrierHitsArr,
          'carrier',
          attackCoord
        );
      } else if (battleShipArr.includes(attackCoord)) {
        attackResponse(
          hits,
          battleShipArr,
          battleShipHitsArr,
          'battleship',
          attackCoord
        );
      } else if (cruiser1Arr.includes(attackCoord)) {
        attackResponse(
          hits,
          cruiser1Arr,
          cruiser1HitsArr,
          'cruiser',
          attackCoord
        );
      } else if (cruiser2Arr.includes(attackCoord)) {
        attackResponse(
          hits,
          cruiser2Arr,
          cruiser2HitsArr,
          'cruiser',
          attackCoord
        );
      } else if (destroyerArr.includes(attackCoord)) {
        attackResponse(
          hits,
          destroyerArr,
          destroyerHitsArr,
          'destroyer',
          attackCoord
        );
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
  gridBuild(10);
  misses = [];
  hits = [];
  allShips = [];

  setAllShips();

  while (!compareCoords(hits, allShips.flat())) {
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
