const WIDTH = 200;
const HEIGHT = 200;
const T_SIZE = 4;

let generation = 0;

let colorList = [
	"#000000", //[0] special - neutral
	"#FFFFFF", //[1] special - EVIL
	//[2-255] warrior colors
	"AliceBlue",
	"AntiqueWhite",
	"Aqua",
	"Aquamarine",
	"Azure",
	"Beige",
	"Bisque",
	"BlanchedAlmond",
	"Blue",
	"BlueViolet",
	"Brown",
	"BurlyWood",
	"CadetBlue",
	"Chartreuse",
	"Chocolate",
	"Coral",
	"CornflowerBlue",
	"Cornsilk",
	"Crimson",
	"Cyan",
	"DarkBlue",
	"DarkCyan",
	"DarkGoldenRod",
	"DarkGray",
	"DarkGrey",
	"DarkGreen",
	"DarkKhaki",
	"DarkMagenta",
	"DarkOliveGreen",
	"Darkorange",
	"DarkOrchid",
	"DarkRed",
	"DarkSalmon",
	"DarkSeaGreen",
	"DarkSlateBlue",
	"DarkSlateGray",
	"DarkSlateGrey",
	"DarkTurquoise",
	"DarkViolet",
	"DeepPink",
	"DeepSkyBlue",
	"DimGray",
	"DimGrey",
	"DodgerBlue",
	"FireBrick",
	"FloralWhite",
	"ForestGreen",
	"Fuchsia",
	"Gainsboro",
	"GhostWhite",
	"Gold",
	"GoldenRod",
	"Gray",
	"Grey",
	"Green",
	"GreenYellow",
	"HoneyDew",
	"HotPink",
	"IndianRed",
	"Indigo",
	"Ivory",
	"Khaki",
	"Lavender",
	"LavenderBlush",
	"LawnGreen",
	"LemonChiffon",
	"LightBlue",
	"LightCoral",
	"LightCyan",
	"LightGoldenRodYellow",
	"LightGray",
	"LightGrey",
	"LightGreen",
	"LightPink",
	"LightSalmon",
	"LightSeaGreen",
	"LightSkyBlue",
	"LightSlateGray",
	"LightSlateGrey",
	"LightSteelBlue",
	"LightYellow",
	"Lime",
	"LimeGreen",
	"Linen",
	"Magenta",
	"Maroon",
	"MediumAquaMarine",
	"MediumBlue",
	"MediumOrchid",
	"MediumPurple",
	"MediumSeaGreen",
	"MediumSlateBlue",
	"MediumSpringGreen",
	"MediumTurquoise",
	"MediumVioletRed",
	"MidnightBlue",
	"MintCream",
	"MistyRose",
	"Moccasin",
	"NavajoWhite",
	"Navy",
	"OldLace",
	"Olive",
	"OliveDrab",
	"Orange",
	"OrangeRed",
	"Orchid",
	"PaleGoldenRod",
	"PaleGreen",
	"PaleTurquoise",
	"PaleVioletRed",
	"PapayaWhip",
	"PeachPuff",
	"Peru",
	"Pink",
	"Plum",
	"PowderBlue",
	"Purple",
	"Red",
	"RosyBrown",
	"RoyalBlue",
	"SaddleBrown",
	"Salmon",
	"SandyBrown",
	"SeaGreen",
	"SeaShell",
	"Sienna",
	"Silver",
	"SkyBlue",
	"SlateBlue",
	"SlateGray",
	"SlateGrey",
	"Snow",
	"SpringGreen",
	"SteelBlue",
	"Tan",
	"Teal",
	"Thistle",
	"Tomato",
	"Turquoise",
	"Violet",
	"Wheat",
	"WhiteSmoke",
	"Yellow",
	"YellowGreen"
]

document.getElementById("alive").innerText = colorList.length-2;
let canvas = document.getElementById("canvas");
canvas.width = WIDTH*T_SIZE;
canvas.height = HEIGHT*T_SIZE;

let ctx = canvas.getContext("2d");

let dataOld = new Uint8Array(WIDTH*HEIGHT);
let dataNew = new Uint8Array(WIDTH*HEIGHT);

let livecounter = []

for (var i = 2; i < colorList.length; i++) {
	let rand = Math.floor(Math.random()*dataOld.length);
	while (dataOld[rand] != 0) {
		rand = Math.floor(Math.random()*dataOld.length);
	}
	dataOld[rand] = i;
}

function readValue(x,
	y) {
	if (x<0 || x>=WIDTH) return 0;
	let i = x+y*WIDTH;
	return dataOld[i] ? dataOld[i] : 0
}

function update() {
	for (var i = 0; i < colorList.length; i++) {
		livecounter[i] = 0
	}
	for (var i = 0; i < dataOld.length; i++) {
		let x = i%WIDTH;
		let y = Math.floor(i/WIDTH);
		let self = readValue(x,y);
		if (self === 1) {
			dataNew[i] = self;
		} else {
			let neighbours = [];
			if (readValue(x-1,y)>1) neighbours.push(readValue(x-1,y));
			if (readValue(x+1,y)>1) neighbours.push(readValue(x+1,y));
			if (readValue(x,y-1)>1) neighbours.push(readValue(x,y-1));
			if (readValue(x,y+1)>1) neighbours.push(readValue(x,y+1));
			if (self === 0) {
				if (neighbours.length && Math.random() > 0.5) {
					let num = neighbours[Math.floor(Math.random()*neighbours.length)];
					dataNew[i] = num;
					livecounter[num]++;
				} else {
					dataNew[i] = 0;
					livecounter[0]++;
				}
			} else {
				if (
					readValue(x-1,y) === 0 || readValue(x-1,y) === self ||
					readValue(x+1,y) === 0 || readValue(x+1,y) === self ||
					readValue(x,y-1) === 0 || readValue(x,y-1) === self ||
					readValue(x,y+1) === 0 || readValue(x,y+1) === self
				) {
					neighbours.push(readValue(x,y));
				}
				if (neighbours.length) {
					let num = neighbours[Math.floor(Math.random()*neighbours.length)];
					dataNew[i] = num;
					livecounter[num]++;
				} else {
					dataNew[i] = self;
					livecounter[self]++;
				}
			}
		}
		ctx.fillStyle = colorList[dataNew[i]];
		ctx.fillRect(T_SIZE*x,T_SIZE*y,T_SIZE,T_SIZE)
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
