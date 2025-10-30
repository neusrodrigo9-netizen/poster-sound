let diametro = 40;
let borrarEnCadaFrame = true;
let paletasColores = [ 
  ["#ffe0ef", "#ffb3d9", "#ff80bf", "#ff4da6", "#e60073"],  
  ["#f0f9ff", "#a5f3fc", "#7dd3fc", "#38bdf8", "#0ea5e9"],  
  ["#fff3cd", "#ffcd94", "#ff9f68", "#ff6f61", "#e63946"]           
];
let indicePaleta = 0;
let modoMultiplicar = false;

// Variables de audio
let mic, amp, nivel = 0;

function setup() {
  const contenedor = document.getElementById("contenedor-p5");
  const lienzo = createCanvas(contenedor.clientWidth, 500);
  lienzo.parent("contenedor-p5");
  noStroke();
  background(250);

  // Enlazar botones DOM
  document.getElementById("botonCambiarPaleta").addEventListener("click", cambiarPaleta);
  document.getElementById("botonLimpiar").addEventListener("click", limpiarLienzo);
  document.getElementById("botonGuardar").addEventListener("click", guardarPNG);

  // Botó per activar el micrófon
  document.getElementById("activarSonido").addEventListener("click", async () => {
    await userStartAudio(); // demana permís a l'usuari
    mic = new p5.AudioIn();
    mic.start(() => {
      amp = new p5.Amplitude();
      amp.setInput(mic);
      console.log("Micrófono activado");
    });
  });

  // Efecte de color granate temporal al fer clic
  const botones = document.querySelectorAll("button");
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      boton.style.backgroundColor = "#960435ff"; // granate
      setTimeout(() => {
        boton.style.backgroundColor = "#ff66b3"; // vuelve a rosa
      }, 300);
    });
  });
}

function windowResized() {
  const contenedor = document.getElementById("contenedor-p5");
  resizeCanvas(contenedor.clientWidth, 500);
  background(250);
}

function draw() {
  // AUDIO: recollir nivell de volum
  nivel = amp ? amp.getLevel() : 0;
  let boost = map(nivel, 0, 0.3, 0, 50); // 0–50 px de refuerzo visual

  // Fondo con transparencia dependiente del sonido
  let velo = map(nivel, 0, 0.3, 25, 8);
  if (borrarEnCadaFrame) background(245, 245, 245, velo);

  // Círculo central que responde al volumen
  fill(250, 40, 150);
  circle(mouseX, mouseY, constrain(diametro + boost, 10, 180));

  // Satèlit animadat amb el so
  for (let i = 0; i < 8; i++) {
    let angulo = frameCount * 0.02 + i * TAU / 8;
    let radio = 60 + boost + 20 * sin(frameCount * 0.03 + i);
    let x = mouseX + cos(angulo) * radio;
    let y = mouseY + sin(angulo) * radio;

    fill(paletasColores[indicePaleta][i % paletasColores[indicePaleta].length] + "CC");
    circle(x, y, 18);
  }
}

function keyPressed() {
  if (key === 'B' || key === 'b') borrarEnCadaFrame = !borrarEnCadaFrame;
  if (key === 'M' || key === 'm') {
    modoMultiplicar = !modoMultiplicar;
    blendMode(modoMultiplicar ? MULTIPLY : BLEND);
  }
  if (key === 'S' || key === 's') guardarPNG();
}

function mouseWheel(e) {
  diametro = constrain(diametro + (e.deltaY > 0 ? -4 : 4), 10, 140);
}

function guardarPNG() {
  let f = new Date();
  let nombre = `poster-${f.getHours()}${f.getMinutes()}${f.getSeconds()}`;
  saveCanvas(nombre, 'png');
}

function cambiarPaleta() {
  indicePaleta = (indicePaleta + 1) % paletasColores.length;
}

function limpiarLienzo() {
  background(245);
}


