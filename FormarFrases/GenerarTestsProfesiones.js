import Utils from '../src/Utils.js';
import BERT from '../src/BERT.js';
import process from 'process';


const plantillas = Utils.ReadLines('./data/Partes/plantillas/profesiones.txt');
const generos = [['el', 'ella']];
const profesiones = Utils.ReadTsv('./input/cno/profesiones.handpicked.output.txt');
const determinantes = Utils.ReadTsv('./data/Partes/determinantes/singular.txt');
const nombres = Utils.ReadTsv('./data/Partes/nombres/nombres.tsv');

const adjNegativos = Utils.ReadTsv('./data/Partes/adjetivos/negativos.singular.txt');
const adjPositivos = Utils.ReadTsv('./data/Partes/adjetivos/positivos.singular.txt');
const adjOtros = Utils.ReadTsv('./data/Partes/adjetivos/otros.singular.txt');


let uid = 0;
let pId = 0;
let results = [];


// Test clasico 0
let plantilla = plantillas[0];
for (const genero of generos) {
  for (const profesion of profesiones) {
    
    if(profesion[0].includes(" ")) // Temporal?
      continue;
    
    const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
    const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
    const m1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es [MASK]
    const m2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // Ella es [MASK]

    const items = [s1, s2, m1, m2, ...profesion, uid++, pId, '', '', '', '', '', '', '', '', '', ''];
    results.push(items.join('\t'));
  }
}
Utils.WriteLines('./FormarFrases/tests/test1.profesiones_small.test.tsv', results);

// Test avanzado 1
pId++;
plantilla = plantillas[1];

for (const profesion of profesiones) {
  for ( const determinante of determinantes) {
    for ( const nombre of nombres) {

      if(profesion[0].includes(" ")) // Temporal?
        continue;

      const s1 = Utils.FastInterpolate(plantilla, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantilla, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', profesion[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantilla, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', BERT.MASK]] ); // El es [MASK]
      const m2 = Utils.FastInterpolate(plantilla, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', BERT.MASK]] ); // Ella es [MASK]

      const items = [s1, s2, m1, m2, ...profesion, uid++, pId, ...nombre, ...determinante, '', '', ...profesion, '', ''];
      results.push(items.join('\t'));
    }
  }
}

Utils.WriteLines('./FormarFrases/tests/test2.profesiones_big.test.tsv', results);
//Utils.WriteLines('./FormarFrases/tests/profesiones.test.csv', results.map((x) => x.replace(/\t/g, ';')));

// invertir 1 y 2
results = []
plantilla = plantillas[0];
for (const genero of generos) {
  for (const profesion of profesiones) {
    
    if(profesion[0].includes(" ")) // Temporal?
      continue;
    
    const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
    const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
    const m1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // El es [MASK]
    const m2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', profesion[1]]] ); // Ella es [MASK]

    const items = [s1, s2, m1, m2, ...profesion, uid++, pId, '', '', '', '', '', '', '', '', '', ''];
    results.push(items.join('\t'));
  }
}
Utils.WriteLines('./FormarFrases/tests/test3.profesiones_small_alt.test.tsv', results);

pId++;
plantilla = plantillas[1];

for (const profesion of profesiones) {
  for ( const determinante of determinantes) {
    for ( const nombre of nombres) {

      if(profesion[0].includes(" ")) // Temporal?
        continue;

      const s1 = Utils.FastInterpolate(plantilla, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantilla, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', profesion[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantilla, [['nombre', BERT.MASK], ['determinante', determinante[0]], ['profesion', profesion[0]]] ); // El es [MASK]
      const m2 = Utils.FastInterpolate(plantilla, [['nombre', BERT.MASK], ['determinante', determinante[1]], ['profesion', profesion[1]]] ); // Ella es [MASK]

      const items = [s1, s2, m1, m2, ...nombre, uid++, pId, ...nombre, ...determinante, '', '', ...profesion, '', ''];
      results.push(items.join('\t'));
    }
  }
}

Utils.WriteLines('./FormarFrases/tests/test4.profesiones_big_alt.test.tsv', results);






/* Log odds */
results = [];

// Enmascarar todo el genero, basico 3
pId++;
plantilla = plantillas[0];
for (const genero of generos) {
  for (const profesion of profesiones) {
    
    if(profesion[0].includes(" ")) // Temporal?
      continue;
    
    const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
    const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
    const m1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es [MASK]          ? profesor
    const m2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // Ella es [MASK]        ? profesora
    const g1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesor
    const g2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesora

    const items = [s1, s2, m1, m2, ...profesion, uid++, pId, '', '', '', '', '', '', '', '', g1, g2];
    results.push(items.join('\t'));
  }
}

// Enmascarar todo el avanzado, basico 4
pId++;
plantilla = plantillas[1];

  for (const profesion of profesiones) {
    for ( const determinante of determinantes) {
      for ( const nombre of nombres) {

        if(profesion[0].includes(" ")) // Temporal?
          continue;
  
        const s1 = Utils.FastInterpolate(plantilla, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', profesion[0]]] ); // El caballero es profesor
        const s2 = Utils.FastInterpolate(plantilla, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', profesion[1]]] ); // La dama es profesora
        const m1 = Utils.FastInterpolate(plantilla, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', BERT.MASK]] ); // El caballero es [MASK]     ? profesora
        const m2 = Utils.FastInterpolate(plantilla, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', BERT.MASK]] ); // La dama es [MASK]          ? profesor
        const g1 = Utils.FastInterpolate(plantilla, [['nombre', BERT.MASK], ['determinante', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] [MASK] es [MASK]          ? profesor
        const g2 = Utils.FastInterpolate(plantilla, [['nombre', BERT.MASK], ['determinante', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] [MASK] es [MASK]          ? profesora

        const items = [s1, s2, m1, m2, ...profesion, uid++, pId, ...nombre, ...determinante, '', '', ...profesion, g1, g2];
        results.push(items.join('\t'));
      }
    }
  }



Utils.WriteLines('./FormarFrases/tests/profesiones.odds.test.tsv', results);
//Utils.WriteLines('./FormarFrases/tests/profesiones.odds.test.csv', results.map((x) => x.replace(/\t/g, ';')));
  

/* Log odds genero */
results = [];

// Enmascarar todo el genero, basico 3, test 5
pId++;
plantilla = plantillas[0];
for (const genero of generos) {
  for (const profesion of profesiones) {
    
    if(profesion[0].includes(" ")) // Temporal?
      continue;
    
    const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
    const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
    const m1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // [MASK] es profesor          ? el
    const m2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', profesion[1]]] ); // [MASK] es [MASK]        ? ella
    const g1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesor
    const g2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesora

    const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', g1, g2];
    results.push(items.join('\t'));
  }
}

Utils.WriteLines('./FormarFrases/tests/profesiones.alt.odds.test.tsv', results);


/* Test cargandote el attributo */
results = [];

// Enmascarar todo el genero, basico 3, test 6
pId++;
plantilla = plantillas[0];
for (const genero of generos) {
  for (const profesion of profesiones) {
    
    if(profesion[0].includes(" ")) // Temporal?
      continue;
    
    const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
    const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
    const m1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // [MASK] es profesor          ? el
    const m2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', profesion[1]]] ); // [MASK] es [MASK]        ? ella
    const g1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesor
    const g2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesora
    const a1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es [MASK]          ? attr
    const a2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // El es [MASK]          ? attr

    const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', g1, g2, a1, a2, ...profesion];
    results.push(items.join('\t'));
  }
}

Utils.WriteLines('./FormarFrases/tests/profesiones.6.test.tsv', results);


/* Test 7, solo te quedas con la profesion en masculino y enmascaras el/ella */
results = [];

pId++;
plantilla = plantillas[0];
for (const genero of generos) {
  for (const profesion of profesiones) {
    
    if(profesion[0].includes(" ")) // Temporal?
      continue;
    
    const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
    const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', profesion[0]]] ); // Ella es profesora
    const m1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // [MASK] es profesor          ? el
    const m2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // [MASK] es profesor       ? ella

    const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', '', '', '', '' ,'' ,''];
    results.push(items.join('\t'));
  }
}

Utils.WriteLines('./FormarFrases/tests/test8.profesiones_masculinas_el_ella.test.tsv', results);

/* Test 8 Complementario, enmascaras la profesión y buscas para las frases el/ella */
results = [];

pId++;
plantilla = plantillas[0];
for (const genero of generos) {
  for (const profesion of profesiones) {
    
    if(profesion[0].includes(" ")) // Temporal?
      continue;
    
    const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
    const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', profesion[0]]] ); // Ella es profesora
    const m1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es [MASK]         ? profesor
    const m2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // Ella es [MASK]       ? profesora

    const items = [s1, s2, m1, m2, profesion[0], profesion[0], uid++, pId, '', '', '', '', '', '', '', '', '', '', '', '' ,'' ,''];
    results.push(items.join('\t'));
  }
}

Utils.WriteLines('./FormarFrases/tests/test8.profesiones_masculinas_el_ella.test.tsv', results);

/* Tests Adjetivos */
results = [];

function generarTestAdjetivos(listaAdjetivos){

  let lines = [];
  pId++;
  plantilla = '{genero} es {adjetivo}';
  for (const genero of generos) {
    for (const adjetivo of listaAdjetivos) {
            
      const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['adjetivo', adjetivo[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['adjetivo', adjetivo[0]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['adjetivo', BERT.MASK]] ); // El es [MASK]         ? profesor
      const m2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['adjetivo', BERT.MASK]] ); // Ella es [MASK]       ? profesora
  
      const items = [s1, s2, m1, m2, ...adjetivo, uid++, pId, '', '', '', '', '', '', '', '', '', '', '', '' ,'' ,''];
      lines.push(items.join('\t'));
    }
  }
  
  return lines; 

}

function generarTestAdjetivosEnmascaraGenero(listaAdjetivos){

  let lines = [];
  pId++;
  plantilla = '{genero} es {adjetivo}';
  for (const genero of generos) {
    for (const adjetivo of listaAdjetivos) {
            
      const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['adjetivo', adjetivo[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['adjetivo', adjetivo[0]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['adjetivo', adjetivo[0]]] ); // El es [MASK]         ? profesor
      const m2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['adjetivo', adjetivo[1]]] ); // Ella es [MASK]       ? profesora
  
      const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', '', '', '', '' ,'' ,''];
      lines.push(items.join('\t'));
    }
  }
  
  return lines; 

}

// Enmascara el adjetivo
//    9 - Adjetivos positivos. 
//    10 - Adjetivos otros. 
//    11 - Adjetivos negativos. 
Utils.WriteLines('./FormarFrases/tests/test9.adjetivos_enmascarados_positivos.test.tsv', generarTestAdjetivos(adjPositivos));
Utils.WriteLines('./FormarFrases/tests/test10.adjetivos_enmascarados_otros.test.tsv', generarTestAdjetivos(adjOtros));
Utils.WriteLines('./FormarFrases/tests/test11.adjetivos_enmascarados_negativos.test.tsv', generarTestAdjetivos(adjNegativos));

// Enmascara el genero
//    12 - Adjetivos positivos. 
//    13 - Adjetivos otros. 
//    14 - Adjetivos negativos. 
Utils.WriteLines('./FormarFrases/tests/test12.genero_adjetivos_enmascarados_positivos.test.tsv', generarTestAdjetivosEnmascaraGenero(adjPositivos));
Utils.WriteLines('./FormarFrases/tests/test13.genero_adjetivos_enmascarados_otros.test.tsv', generarTestAdjetivosEnmascaraGenero(adjOtros));
Utils.WriteLines('./FormarFrases/tests/test14.genero_adjetivos_enmascarados_negativos.test.tsv', generarTestAdjetivosEnmascaraGenero(adjNegativos));
