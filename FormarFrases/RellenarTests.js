import Utils from '../src/Utils.js';
import BERT from '../src/BERT.js';


const plantillas = Utils.ReadLines('./data/Partes/plantillas/profesiones.txt');
const generos = [['el', 'ella']];// Utils.ReadTsv('./data/Partes/determinantes/singular.txt');
const profesiones = Utils.ReadTsv('./input/cno/profesiones.handpicked.output.txt');
const determinantes = Utils.ReadTsv('./data/Partes/determinantes/singular.txt');
const nombres = Utils.ReadTsv('./data/Partes/nombres/nombres.tsv');

let uid = 0;
let pId = 0;
const results = [];

let plantilla = plantillas[0];
for (const genero of generos) {
  for (const profesion of profesiones) {
    const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
    const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', profesion[1]]] ); // El es profesor
    const m1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es profesor
    const m2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // El es profesor

    const items = [s1, s2, m1, m2, ...profesion, uid++, pId, '', '', '', '', '', '', '', ''];
    results.push(items.join('\t'));
  }
}


pId++;
plantilla = plantillas[1];

for (const genero of generos) {
  for (const profesion of profesiones) {
    for ( const determinante of determinantes) {
      for ( const nombre of nombres) {
        const s1 = Utils.FastInterpolate(plantilla, [['nombre', nombre[0]], ['determinante', determinante[0]], ['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
        const s2 = Utils.FastInterpolate(plantilla, [['nombre', nombre[1]], ['determinante', determinante[1]], ['genero', genero[1]], ['profesion', profesion[1]]] ); // El es profesor
        const m1 = Utils.FastInterpolate(plantilla, [['nombre', nombre[0]], ['determinante', determinante[0]], ['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es profesor
        const m2 = Utils.FastInterpolate(plantilla, [['nombre', nombre[1]], ['determinante', determinante[1]], ['genero', genero[1]], ['profesion', BERT.MASK]] ); // El es profesor

        const items = [s1, s2, m1, m2, ...profesion, uid++, pId, ...nombre, ...determinante, ...genero, ...profesion];
        results.push(items.join('\t'));
      }
    }
  }
}


Utils.WriteLines('./FormarFrases/tests/profesiones.test.tsv', results);
Utils.WriteLines('./FormarFrases/tests/profesiones.test.csv', results.map((x) => x.replace(/\t/g, ';')));
