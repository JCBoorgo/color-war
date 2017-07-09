const WIDTH = 200;
const HEIGHT = 200;
const T_SIZE = 4;

let generation = 0;

let colorList = [
  "#000000", //[0] special - neutral
  "#FFFFFF", //[1] special - EVIL
  //[2-255] warrior colors
  "Red",
  "Blue",
  "Green",
  "Yellow",
	"Purple",
	"Pink",
	"Brown",
	"Orange"
]

document.getElementById("alive").innerText = colorList.length - 2;
let canvas = document.getElementById("canvas");
canvas.width = WIDTH * T_SIZE;
canvas.height = HEIGHT * T_SIZE;

let ctx = canvas.getContext("2d");

let dataOld = new Uint8Array(WIDTH * HEIGHT);
let dataNew = new Uint8Array(WIDTH * HEIGHT);

let livecounter = []

for (var i = 2; i < colorList.length; i++) {
  let rand = Math.floor(Math.random() * dataOld.length);
  while (dataOld[rand] != 0) {
    rand = Math.floor(Math.random() * dataOld.length);
  }
  dataOld[rand] = i;
}

function readValue(x,
  y) {
  if (x < 0 || x >= WIDTH) return 0;
  let i = x + y * WIDTH;
  return dataOld[i] ? dataOld[i] : 0
}

function update() {
  for (var i = 0; i < colorList.length; i++) {
    livecounter[i] = 0
  }
  for (var i = 0; i < dataOld.length; i++) {
    let x = i % WIDTH;
    let y = Math.floor(i / WIDTH);
    let self = readValue(x, y);
    if (self === 1) {
      dataNew[i] = self;
    } else {
      let neighbours = [];
      for (let filler = 0; filler < colorList.length; filler++) {
        neighbours[filler] = 0;
      }
      if (readValue(x - 1, y) > 1) neighbours[readValue(x - 1, y)]++;
      if (readValue(x + 1, y) > 1) neighbours[readValue(x + 1, y)]++;
      if (readValue(x, y - 1) > 1) neighbours[readValue(x, y - 1)]++;
      if (readValue(x, y + 1) > 1) neighbours[readValue(x, y + 1)]++;
      let flag = false;
      for (let n = 0; n < neighbours.length; n++) {
        if (neighbours[n] > 0) {
          flag = true;
          break;
        }
      }
      if (flag) {
        if (readValue(x - 1, y) > 1)  {
          neighbours[readValue(x - 1, y)]++;
          let streak = readValue(x - 1, y);
          let n = 2;
          while (readValue(x - n, y) === streak) {
            neighbours[readValue(x - n, y)]++;
            n++;
          }
        }
        if (readValue(x + 1, y) > 1) {
          neighbours[readValue(x + 1, y)]++;
          let streak = readValue(x + 1, y);
          let n = 2;
          while (readValue(x + n, y) === streak) {
            neighbours[readValue(x + n, y)]++;
            n++;
          }
        }
        if (readValue(x, y - 1) > 1) {
          neighbours[readValue(x, y - 1)]++;
          let streak = readValue(x, y - 1);
          let n = 2;
          while (readValue(x, y - n) === streak) {
            neighbours[readValue(x, y - n)]++;
            n++;
          }
        }
        if (readValue(x, y + 1) > 1) {
          neighbours[readValue(x, y + 1)]++;
          let streak = readValue(x, y + 1);
          let n = 2;
          while (readValue(x, y + n) === streak) {
            neighbours[readValue(x, y + n)]++;
            n++;
          }
        }
      }
      if (self === 0) {
        let numberOfNeighbours = 0;
        for (let n = 2; n < neighbours.length; n++) {
          if (neighbours[n]) {
            neighbours[n] *= neighbours[n];
            numberOfNeighbours += neighbours[n];
          }
        }
        if (numberOfNeighbours && Math.random() > 0.5) {
          let count = 0;
          let random = Math.floor(Math.random() * numberOfNeighbours)
          let pick = 2;
					while (neighbours[pick] === 0) {
						pick++
					}
					count += neighbours[pick];
          while (count < random) {
						pick++;
            count += neighbours[pick];
          }
          dataNew[i] = pick;
          livecounter[pick]++;
        } else {
          dataNew[i] = 0;
          livecounter[0]++;
        }
      } else {
        if (
          readValue(x - 1, y) === 0 || readValue(x - 1, y) === self ||
          readValue(x + 1, y) === 0 || readValue(x + 1, y) === self ||
          readValue(x, y - 1) === 0 || readValue(x, y - 1) === self ||
          readValue(x, y + 1) === 0 || readValue(x, y + 1) === self
        ) {
          neighbours[readValue(x, y)]++;
        }
        let numberOfNeighbours = 0;
        for (let n = 2; n < neighbours.length; n++) {
          if (neighbours[n]) {
            neighbours[n] *= neighbours[n];
            numberOfNeighbours += neighbours[n];
          }
        }
        if (numberOfNeighbours) {
          let count = 0;
          let random = Math.floor(Math.random() * numberOfNeighbours)
          let pick = 2;
					while(neighbours[pick] === 0) {
						pick++;
					}
					count += neighbours[pick];
          while (count < random) {
						pick++;
            count += neighbours[pick];
          }
          dataNew[i] = pick;
          livecounter[pick]++;
        } else {
          dataNew[i] = self;
          livecounter[self]++;
        }
      }
    }
    ctx.fillStyle = colorList[dataNew[i]];
    ctx.fillRect(T_SIZE * x, T_SIZE * y, T_SIZE, T_SIZE)
  }
  let temp = dataOld;
  let alive = 0;
  dataOld = dataNew;
  dataNew = temp;
  generation++;
  for (var i = 2; i < colorList.length; i++) {
    if (livecounter[i]) alive++;
  }
  document.getElementById("generation").innerText = generation;
  document.getElementById("alive").innerText = alive;
  if (generation > 1) {
    requestAnimationFrame(update);
  }
}

requestAnimationFrame(update);
