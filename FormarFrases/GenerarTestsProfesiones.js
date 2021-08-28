import Utils from '../src/Utils.js';
import BERT from '../src/BERT.js';


const plantillas = Utils.ReadLines('./data/Partes/plantillas/profesiones.txt');
const generos = [['el', 'ella'], ['Juan', 'Juana'], ['Mario', 'María']];
const profesiones = Utils.ReadTsv('./input/cno/profesiones.handpicked.output.no_spaces.txt');
const determinantes = Utils.ReadTsv('./data/Partes/determinantes/singular.txt');
const nombres = Utils.ReadTsv('./data/Partes/nombres/nombres.tsv');

const adjNegativos = Utils.ReadTsv('./data/Partes/adjetivos/negativos.singular.txt');
const adjPositivos = Utils.ReadTsv('./data/Partes/adjetivos/positivos.singular.txt');
const adjOtros = Utils.ReadTsv('./data/Partes/adjetivos/otros.singular.txt');
const adjColores = Utils.ReadTsv('./data/Partes/adjetivos/colores.txt');

// Mezcla equilibrada de adj positivos, negativos y otros. Se mete un color al final para llegar a los 100.
const adjMixed = [];
Array(33).fill(0).map((_, i) => {
  adjMixed.push(adjNegativos[i]);
  adjMixed.push(adjPositivos[i]);
  adjMixed.push(adjOtros[i]);
});
adjMixed.push(adjColores[0]);



let uid = 0;
let pId = 0;
let results = [];

let dictEscrituras = {};

function WriteTest(lines, masked_items, tested_item, tested_with, extra = ''){
  let prePath = './FormarFrases/tests/';
  let path = prePath + masked_items + '/' + tested_item + "_foreach_" + tested_with;
  if(extra != '')
    path = path + "_" + extra;
  path += ".test.tsv";
  Utils.WriteLines(path, lines);
  dictEscrituras[path] = dictEscrituras[path] ? dictEscrituras[path] + 1 : 0;
}

/*
██████  ██████   ██████  ███████ ███████ ███████ ██  ██████  ███    ██ ███████ ███████         ███    ███ 
██   ██ ██   ██ ██    ██ ██      ██      ██      ██ ██    ██ ████   ██ ██      ██              ████  ████ 
██████  ██████  ██    ██ █████   █████   ███████ ██ ██    ██ ██ ██  ██ █████   ███████         ██ ████ ██ 
██      ██   ██ ██    ██ ██      ██           ██ ██ ██    ██ ██  ██ ██ ██           ██         ██  ██  ██ 
██      ██   ██  ██████  ██      ███████ ███████ ██  ██████  ██   ████ ███████ ███████ ███████ ██      ██ 
*/                                                                                                                                                                                                                 

// Test clasico 0
let plantilla = plantillas[0];

let plantillasGenero = [plantillas[0], plantillas[2]];
let plantillasDeterminante = [plantillas[1], plantillas[3]];

for(const plantillaIt of plantillasGenero){
  for (const genero of generos) {
    for (const profesion of profesiones) {
      
      if(profesion[0].includes(" ")) // Temporal?
        continue;
      
      const s1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es [MASK]
      const m2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // Ella es [MASK]

      const items = [s1, s2, m1, m2, ...profesion, uid++, pId, '', '', '', '', '', '', '', '', '', ''];
      results.push(items.join('\t'));
    }
  }
}

WriteTest(results, 'profesion', 'profesion', 'genero', '1_small');
//Utils.WriteLines('./FormarFrases/tests/test1.profesiones_small.test.tsv', results);

// Test avanzado 1
pId++;
plantilla = plantillas[1];

for(const plantillaIt of plantillasDeterminante){
  for (const profesion of profesiones) {
    for ( const determinante of determinantes) {
      for ( const nombre of nombres) {

        if(profesion[0].includes(" ")) // Temporal?
          continue;

        const s1 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', profesion[0]]] ); // El es profesor
        const s2 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', profesion[1]]] ); // Ella es profesora
        const m1 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', BERT.MASK]] ); // El es [MASK]
        const m2 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', BERT.MASK]] ); // Ella es [MASK]

        const items = [s1, s2, m1, m2, ...profesion, uid++, pId, ...nombre, ...determinante, '', '', ...profesion, '', ''];
        results.push(items.join('\t'));
      }
    }
  }
}

WriteTest(results, 'profesion', 'profesion', 'genero', '2_big');
// Utils.WriteLines('./FormarFrases/tests/test2.profesiones_big.test.tsv', results);


/*
██████  ██████   ██████  ███████ ███████ ███████ ██  ██████  ███    ██ ███████ ███████          ██████  ███████ ███    ██ ███████ ██████   ██████          ███    ███ 
██   ██ ██   ██ ██    ██ ██      ██      ██      ██ ██    ██ ████   ██ ██      ██              ██       ██      ████   ██ ██      ██   ██ ██    ██         ████  ████ 
██████  ██████  ██    ██ █████   █████   ███████ ██ ██    ██ ██ ██  ██ █████   ███████         ██   ███ █████   ██ ██  ██ █████   ██████  ██    ██         ██ ████ ██ 
██      ██   ██ ██    ██ ██      ██           ██ ██ ██    ██ ██  ██ ██ ██           ██         ██    ██ ██      ██  ██ ██ ██      ██   ██ ██    ██         ██  ██  ██ 
██      ██   ██  ██████  ██      ███████ ███████ ██  ██████  ██   ████ ███████ ███████ ███████  ██████  ███████ ██   ████ ███████ ██   ██  ██████  ███████ ██      ██ 
*/

// invertir 1 y 2
results = []
plantilla = plantillas[0];
for(const plantillaIt of plantillasGenero){
  for (const genero of generos) {
    for (const profesion of profesiones) {
      
      if(profesion[0].includes(" ")) // Temporal?
        continue;
      
      const s1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // El es [MASK]
      const m2 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', profesion[1]]] ); // Ella es [MASK]

      const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', '', ''];
      results.push(items.join('\t'));
    }
  }
}

WriteTest(results, 'genero', 'genero', 'profesion', '1_small');

// Utils.WriteLines('./FormarFrases/tests/test3.profesiones_small_alt.test.tsv', results);

pId++;
plantilla = plantillas[1];

for(const plantillaIt of plantillasDeterminante){
  for (const profesion of profesiones) {
    for ( const determinante of determinantes) {
      for ( const nombre of nombres) {

        if(profesion[0].includes(" ")) // Temporal?
          continue;

        const s1 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', profesion[0]]] ); // El es profesor
        const s2 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', profesion[1]]] ); // Ella es profesora
        const m1 = Utils.FastInterpolate(plantillaIt, [['nombre', BERT.MASK], ['determinante', determinante[0]], ['profesion', profesion[0]]] ); // El es [MASK]
        const m2 = Utils.FastInterpolate(plantillaIt, [['nombre', BERT.MASK], ['determinante', determinante[1]], ['profesion', profesion[1]]] ); // Ella es [MASK]

        const items = [s1, s2, m1, m2, ...nombre, uid++, pId, ...nombre, ...determinante, '', '', ...profesion, '', ''];
        results.push(items.join('\t'));
      }
    }
  }
}

WriteTest(results, 'genero', 'genero', 'profesion', '2_big');
//Utils.WriteLines('./FormarFrases/tests/test4.profesiones_big_alt.test.tsv', results);


/* Log odds */
results = [];

// Enmascarar todo el genero, basico 3
pId++;
plantilla = plantillas[0];

for(const plantillaIt of plantillasGenero){
  for (const genero of generos) {
    for (const profesion of profesiones) {
      
      if(profesion[0].includes(" ")) // Temporal?
        continue;
      
      const s1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es [MASK]          ? profesor
      const m2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // Ella es [MASK]        ? profesora
      const g1 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesor
      const g2 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesora

      const items = [s1, s2, m1, m2, ...profesion, uid++, pId, '', '', '', '', '', '', '', '', g1, g2];
      results.push(items.join('\t'));
    }
  }
}

// Enmascarar todo el avanzado, basico 4
pId++;
plantilla = plantillas[1];

for(const plantillaIt of plantillasDeterminante){
  for (const profesion of profesiones) {
    for ( const determinante of determinantes) {
      for ( const nombre of nombres) {

        if(profesion[0].includes(" ")) // Temporal?
          continue;
  
        const s1 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', profesion[0]]] ); // El caballero es profesor
        const s2 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', profesion[1]]] ); // La dama es profesora
        const m1 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[0]], ['determinante', determinante[0]], ['profesion', BERT.MASK]] ); // El caballero es [MASK]     ? profesora
        const m2 = Utils.FastInterpolate(plantillaIt, [['nombre', nombre[1]], ['determinante', determinante[1]], ['profesion', BERT.MASK]] ); // La dama es [MASK]          ? profesor
        const g1 = Utils.FastInterpolate(plantillaIt, [['nombre', BERT.MASK], ['determinante', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] [MASK] es [MASK]          ? profesor
        const g2 = Utils.FastInterpolate(plantillaIt, [['nombre', BERT.MASK], ['determinante', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] [MASK] es [MASK]          ? profesora

        const items = [s1, s2, m1, m2, ...profesion, uid++, pId, ...nombre, ...determinante, '', '', ...profesion, g1, g2];
        results.push(items.join('\t'));
      }
    }
  }
}

WriteTest(results, 'nombre_determinante_profesion', 'profesion', 'nombre_determinante', 'odss');

//Utils.WriteLines('./FormarFrases/tests/profesiones.odds.test.tsv', results);
  

/* Log odds genero */
results = [];

// Enmascarar todo el genero, basico 3, test 5
pId++;
plantilla = plantillas[0];

for(const plantillaIt of plantillasGenero){
  for (const genero of generos) {
    for (const profesion of profesiones) {
      
      if(profesion[0].includes(" ")) // Temporal?
        continue;
      
      const s1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // [MASK] es profesor          ? el
      const m2 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', profesion[1]]] ); // [MASK] es [MASK]        ? ella
      const g1 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesor
      const g2 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesora

      const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', g1, g2];
      results.push(items.join('\t'));
    }
  }
}

WriteTest(results, 'genero_profesion', 'genero', 'profesion', 'odss');
//Utils.WriteLines('./FormarFrases/tests/profesiones.alt.odds.test.tsv', results);


/* Test cargandote el attributo */
results = [];

// Enmascarar todo el genero, basico 3, test 6
pId++;
plantilla = plantillas[0];

for(const plantillaIt of plantillasGenero){
  for (const genero of generos) {
    for (const profesion of profesiones) {
      
      if(profesion[0].includes(" ")) // Temporal?
        continue;
      
      const s1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', profesion[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // [MASK] es profesor          ? el
      const m2 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', profesion[1]]] ); // [MASK] es [MASK]        ? ella
      const g1 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesor
      const g2 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', BERT.MASK]] ); // [MASK] es [MASK]      ? profesora
      const a1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es [MASK]          ? attr
      const a2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // El es [MASK]          ? attr

      const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', g1, g2, a1, a2, ...profesion];
      results.push(items.join('\t'));
    }
  }
}

WriteTest(results, 'genero_profesion', 'profesion', 'genero', 'odss');
Utils.WriteLines('./FormarFrases/tests/Z_Revisar/profesiones.6.test.tsv', results);
//Utils.WriteLines('./FormarFrases/tests/profesiones.6.test.tsv', results);

/*
██████  ██████   ██████  ███████ ███████ ███████ ██  ██████  ███    ██ ███████ ███████         ███    ███     ███    ███  █████  ███████  ██████ 
██   ██ ██   ██ ██    ██ ██      ██      ██      ██ ██    ██ ████   ██ ██      ██              ████  ████     ████  ████ ██   ██ ██      ██      
██████  ██████  ██    ██ █████   █████   ███████ ██ ██    ██ ██ ██  ██ █████   ███████         ██ ████ ██     ██ ████ ██ ███████ ███████ ██      
██      ██   ██ ██    ██ ██      ██           ██ ██ ██    ██ ██  ██ ██ ██           ██         ██  ██  ██     ██  ██  ██ ██   ██      ██ ██      
██      ██   ██  ██████  ██      ███████ ███████ ██  ██████  ██   ████ ███████ ███████ ███████ ██      ██     ██      ██ ██   ██ ███████  ██████ 
*/                                                                                                                                                                                                                                                                                                 

/* Test 7, solo te quedas con la profesion en masculino y enmascaras el/ella */
results = [];

pId++;
plantilla = plantillas[0];
for(const plantillaIt of plantillasGenero){
  for (const genero of generos) {
    for (const profesion of profesiones) {
      
      if(profesion[0].includes(" ")) // Temporal?
        continue;
      
      const s1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', profesion[0]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // [MASK] es profesor          ? el
      const m2 = Utils.FastInterpolate(plantillaIt, [['genero', BERT.MASK], ['profesion', profesion[0]]] ); // [MASK] es profesor       ? ella

      const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', '', '', '', '' ,'' ,''];
      results.push(items.join('\t'));
    }
  }
}

WriteTest(results, 'genero', 'genero', 'profesion', 'masculina_el_ella');

//Utils.WriteLines('./FormarFrases/tests/5_genero_enmascarado_profesion_masculina/1_el_ella.test.tsv', results);

/*
██████  ██████   ██████  ███████ ███████ ███████ ██  ██████  ███    ██ ███████ ███████          ██████  ███████ ███    ██ ███████ ██████   ██████          ███    ███     ███    ███  █████  ███████  ██████ 
██   ██ ██   ██ ██    ██ ██      ██      ██      ██ ██    ██ ████   ██ ██      ██              ██       ██      ████   ██ ██      ██   ██ ██    ██         ████  ████     ████  ████ ██   ██ ██      ██      
██████  ██████  ██    ██ █████   █████   ███████ ██ ██    ██ ██ ██  ██ █████   ███████         ██   ███ █████   ██ ██  ██ █████   ██████  ██    ██         ██ ████ ██     ██ ████ ██ ███████ ███████ ██      
██      ██   ██ ██    ██ ██      ██           ██ ██ ██    ██ ██  ██ ██ ██           ██         ██    ██ ██      ██  ██ ██ ██      ██   ██ ██    ██         ██  ██  ██     ██  ██  ██ ██   ██      ██ ██      
██      ██   ██  ██████  ██      ███████ ███████ ██  ██████  ██   ████ ███████ ███████ ███████  ██████  ███████ ██   ████ ███████ ██   ██  ██████  ███████ ██      ██     ██      ██ ██   ██ ███████  ██████ 
*/                                                                                                                                                                                                             
                                                                                                                                                                                                             
/* Test 8 Complementario, enmascaras la profesión y buscas para las frases el/ella */
results = [];

pId++;
plantilla = plantillas[0];

for(const plantillaIt of plantillasGenero){
  for (const genero of generos) {
    for (const profesion of profesiones) {
      
      if(profesion[0].includes(" ")) // Temporal?
        continue;
      
      const s1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', profesion[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', profesion[0]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantillaIt, [['genero', genero[0]], ['profesion', BERT.MASK]] ); // El es [MASK]         ? profesor
      const m2 = Utils.FastInterpolate(plantillaIt, [['genero', genero[1]], ['profesion', BERT.MASK]] ); // Ella es [MASK]       ? profesora

      const items = [s1, s2, m1, m2, profesion[0], profesion[0], uid++, pId, '', '', '', '', '', '', '', '', '', '', '', '' ,'' ,''];
      results.push(items.join('\t'));
    }
  }
}

WriteTest(results, 'profesion', 'profesion_masculina', 'genero');
//Utils.WriteLines('./FormarFrases/tests/6_profesion_enmascarado_genero_m.test.tsv', results);

/*
 █████  ██████       ██ ███████ ████████ ██ ██    ██  ██████  ███████ 
██   ██ ██   ██      ██ ██         ██    ██ ██    ██ ██    ██ ██      
███████ ██   ██      ██ █████      ██    ██ ██    ██ ██    ██ ███████ 
██   ██ ██   ██ ██   ██ ██         ██    ██  ██  ██  ██    ██      ██ 
██   ██ ██████   █████  ███████    ██    ██   ████    ██████  ███████ 
*/

/* Tests Adjetivos */
results = [];

function generarTestAdjetivos(listaAdjetivos){

  let lines = [];
  pId++;
  plantilla = '{genero} es {adjetivo}';
  for (const genero of generos) {
    for (const adjetivo of listaAdjetivos) {
            
      const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['adjetivo', adjetivo[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['adjetivo', adjetivo[1]]] ); // Ella es profesora
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
      const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['adjetivo', adjetivo[1]]] ); // Ella es profesora
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
WriteTest(generarTestAdjetivos(adjPositivos), 'adjetivo', 'adjetivo', 'genero', 'positivos');
WriteTest(generarTestAdjetivos(adjOtros), 'adjetivo', 'adjetivo', 'genero', 'otros');
WriteTest(generarTestAdjetivos(adjColores), 'adjetivo', 'adjetivo', 'genero', 'colores');
WriteTest(generarTestAdjetivos(adjNegativos), 'adjetivo', 'adjetivo', 'genero', 'negativos');
WriteTest(generarTestAdjetivos(adjMixed), 'adjetivo', 'adjetivo', 'genero', 'mezclados');

// Utils.WriteLines('./FormarFrases/tests/test9.adjetivos_enmascarados_positivos.test.tsv', generarTestAdjetivos(adjPositivos));
// Utils.WriteLines('./FormarFrases/tests/test10.adjetivos_enmascarados_otros.test.tsv', generarTestAdjetivos(adjOtros));
// Utils.WriteLines('./FormarFrases/tests/test10.adjetivos_enmascarados_otros.test.tsv', generarTestAdjetivos(adjColores));
// Utils.WriteLines('./FormarFrases/tests/test11.adjetivos_enmascarados_negativos.test.tsv', generarTestAdjetivos(adjNegativos));

// Enmascara el genero
//    12 - Adjetivos positivos. 
//    13 - Adjetivos otros. 
//    14 - Adjetivos negativos. 
WriteTest(generarTestAdjetivosEnmascaraGenero(adjPositivos), 'genero', 'genero', 'adjetivo', 'positivos');
WriteTest(generarTestAdjetivosEnmascaraGenero(adjOtros), 'genero', 'genero', 'adjetivo', 'otros');
WriteTest(generarTestAdjetivosEnmascaraGenero(adjColores), 'genero', 'genero', 'adjetivo', 'colores');
WriteTest(generarTestAdjetivosEnmascaraGenero(adjNegativos), 'genero', 'genero', 'adjetivo', 'negativos');
WriteTest(generarTestAdjetivosEnmascaraGenero(adjMixed), 'genero', 'genero', 'adjetivo', 'mezclados');



// Utils.WriteLines('./FormarFrases/tests/test12.genero_adjetivos_enmascarados_positivos.test.tsv', generarTestAdjetivosEnmascaraGenero(adjPositivos));
// Utils.WriteLines('./FormarFrases/tests/test13.genero_adjetivos_enmascarados_otros.test.tsv', generarTestAdjetivosEnmascaraGenero(adjOtros));
// Utils.WriteLines('./FormarFrases/tests/test14.genero_adjetivos_enmascarados_negativos.test.tsv', generarTestAdjetivosEnmascaraGenero(adjNegativos));



/*
 █████  ██████       ██ ███████ ████████ ██ ██    ██  ██████  ███████      ██████  ██████   █████  ███    ██ ██████  ███████ 
██   ██ ██   ██      ██ ██         ██    ██ ██    ██ ██    ██ ██          ██       ██   ██ ██   ██ ████   ██ ██   ██ ██      
███████ ██   ██      ██ █████      ██    ██ ██    ██ ██    ██ ███████     ██   ███ ██████  ███████ ██ ██  ██ ██   ██ █████   
██   ██ ██   ██ ██   ██ ██         ██    ██  ██  ██  ██    ██      ██     ██    ██ ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      
██   ██ ██████   █████  ███████    ██    ██   ████    ██████  ███████      ██████  ██   ██ ██   ██ ██   ████ ██████  ███████ 
*/

function generarTestAdjetivosEnmascaraGeneroGrande(listaAdjetivos, plantilla = 'su {genero} es {adjetivo}'){

  let lines = [];
  let genero_nombres = [
    ['padre', 'madre'],
    ['hijo', 'hija'],
    ['hermano', 'hermana'],
    ['abuelo', 'abuela'],
    ['vecino', 'vecina'],     
    ['compañero', 'compañera'],
    ['marido', 'esposa'],
    ['jefe', 'jefa'],
    //['enfermero', 'enfermera'],
    //['doctor', 'doctora']
  ];
  pId++;

  for (const genero of genero_nombres) {
    for (const adjetivo of listaAdjetivos) {
            
      const s1 = Utils.FastInterpolate(plantilla, [['genero', genero[0]], ['adjetivo', adjetivo[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantilla, [['genero', genero[1]], ['adjetivo', adjetivo[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['adjetivo', adjetivo[0]]] ); // El es [MASK]         ? profesor
      const m2 = Utils.FastInterpolate(plantilla, [['genero', BERT.MASK], ['adjetivo', adjetivo[1]]] ); // Ella es [MASK]       ? profesora
  
      const items = [s1, s2, m1, m2, ...genero, uid++, pId, '', '', '', '', '', '', '', '', '', '', '', '' ,'' ,''];
      lines.push(items.join('\t'));
    }
  }
  
  return lines; 

}

// Enmascara el genero - Grande
//    15 - Adjetivos positivos. 
//    16 - Adjetivos otros. 
//    17 - Adjetivos negativos. 
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjPositivos), 'genero', 'genero', 'adjetivo', 'positivos', 'grande');
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjOtros), 'genero', 'genero', 'adjetivo', 'otros', 'grande');
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjColores), 'genero', 'genero', 'adjetivo', 'colores', 'grande');
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjNegativos), 'genero', 'genero', 'adjetivo', 'negativos', 'grande');
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjMixed), 'genero', 'genero', 'adjetivo', 'mezclados', 'grande');

// Utils.WriteLines('./FormarFrases/tests/test15.genero_adjetivos_enmascarados_positivos_grande.test.tsv', generarTestAdjetivosEnmascaraGeneroGrande(adjPositivos));
// Utils.WriteLines('./FormarFrases/tests/test16.genero_adjetivos_enmascarados_otros_grande.test.tsv', generarTestAdjetivosEnmascaraGeneroGrande(adjOtros));
// Utils.WriteLines('./FormarFrases/tests/test17.genero_adjetivos_enmascarados_negativos_grande.test.tsv', generarTestAdjetivosEnmascaraGeneroGrande(adjNegativos));

// Niega la frase - Enmascara el genero - Grande
//    21 - Adjetivos positivos con negación. 
//    22 - Adjetivos otros con negación. 
//    23 - Adjetivos negativos con negación. 
let plantillaNegada = 'su {genero} no es {adjetivo}';
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjPositivos, plantillaNegada), 'genero', 'genero', 'adjetivo', 'positivos', 'plantilla_negada');
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjOtros, plantillaNegada), 'genero', 'genero', 'adjetivo', 'otros', 'plantilla_negada');
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjColores, plantillaNegada), 'genero', 'genero', 'adjetivo', 'colores', 'plantilla_negada');
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjNegativos, plantillaNegada), 'genero', 'genero', 'adjetivo', 'negativos', 'plantilla_negada');
WriteTest(generarTestAdjetivosEnmascaraGeneroGrande(adjMixed, plantillaNegada), 'genero', 'genero', 'adjetivo', 'mezclados', 'plantilla_negada');

// Utils.WriteLines('./FormarFrases/tests/test21.genero_adjetivos_negados_enmascarados_positivos_grande.test.tsv', generarTestAdjetivosEnmascaraGeneroGrande(adjPositivos, plantillaNegada));
// Utils.WriteLines('./FormarFrases/tests/test22.genero_adjetivos_negados_enmascarados_otros_grande.test.tsv', generarTestAdjetivosEnmascaraGeneroGrande(adjOtros, plantillaNegada));
// Utils.WriteLines('./FormarFrases/tests/test23.genero_adjetivos_negados_enmascarados_negativos_grande.test.tsv', generarTestAdjetivosEnmascaraGeneroGrande(adjNegativos, plantillaNegada));

/*
 █████  ██████       ██ ███████ ████████ ██ ██    ██  ██████  ███████      ██████  ██████  ███    ██     ██████  ██████   ██████  ███████ ███████ ███████ ██  ██████  ███    ██ ███████ ███████ 
██   ██ ██   ██      ██ ██         ██    ██ ██    ██ ██    ██ ██          ██      ██    ██ ████   ██     ██   ██ ██   ██ ██    ██ ██      ██      ██      ██ ██    ██ ████   ██ ██      ██      
███████ ██   ██      ██ █████      ██    ██ ██    ██ ██    ██ ███████     ██      ██    ██ ██ ██  ██     ██████  ██████  ██    ██ █████   █████   ███████ ██ ██    ██ ██ ██  ██ █████   ███████ 
██   ██ ██   ██ ██   ██ ██         ██    ██  ██  ██  ██    ██      ██     ██      ██    ██ ██  ██ ██     ██      ██   ██ ██    ██ ██      ██           ██ ██ ██    ██ ██  ██ ██ ██           ██ 
██   ██ ██████   █████  ███████    ██    ██   ████    ██████  ███████      ██████  ██████  ██   ████     ██      ██   ██  ██████  ██      ███████ ███████ ██  ██████  ██   ████ ███████ ███████ 
*/                                                                                                                                                                                                

function generarTestAdjetivosConProfesionesEnmascaraProfesion(listaAdjetivos){

  let lines = [];

  pId++;
  let plantilla_m = 'el {profesion} es {adjetivo}';
  let plantilla_f = 'la {profesion} es {adjetivo}';

  for (const profesion of profesiones) {
    for (const adjetivo of listaAdjetivos) {
            
      const s1 = Utils.FastInterpolate(plantilla_m, [['profesion', profesion[0]], ['adjetivo', adjetivo[0]]] ); // El es profesor
      const s2 = Utils.FastInterpolate(plantilla_f, [['profesion', profesion[1]], ['adjetivo', adjetivo[1]]] ); // Ella es profesora
      const m1 = Utils.FastInterpolate(plantilla_m, [['profesion', BERT.MASK], ['adjetivo', adjetivo[0]]] ); // El es [MASK]         ? profesor
      const m2 = Utils.FastInterpolate(plantilla_f, [['profesion', BERT.MASK], ['adjetivo', adjetivo[1]]] ); // Ella es [MASK]       ? profesora
  
      const items = [s1, s2, m1, m2, ...profesion, uid++, pId, '', '', '', '', '', '', '', '', '', '', '', '' ,'' ,''];
      lines.push(items.join('\t'));
    }
  }
  
  return lines; 

}

// Enmascara el genero - Grande
//    18 - Adjetivos positivos. 
//    19 - Adjetivos otros. 
//    20 - Adjetivos negativos. 
WriteTest(generarTestAdjetivosConProfesionesEnmascaraProfesion(adjPositivos), 'genero', 'genero', 'adjetivo', 'positivos');
WriteTest(generarTestAdjetivosConProfesionesEnmascaraProfesion(adjOtros), 'genero', 'genero', 'adjetivo', 'colores');
WriteTest(generarTestAdjetivosConProfesionesEnmascaraProfesion(adjColores), 'genero', 'genero', 'adjetivo', 'colores');
WriteTest(generarTestAdjetivosConProfesionesEnmascaraProfesion(adjNegativos), 'genero', 'genero', 'adjetivo', 'negativos');
WriteTest(generarTestAdjetivosConProfesionesEnmascaraProfesion(adjMixed), 'genero', 'genero', 'adjetivo', 'mezclados');


// Utils.WriteLines('./FormarFrases/tests/test18.adjetivos_con_profesiones_enmascaradas_positivos.test.tsv', generarTestAdjetivosConProfesionesEnmascaraProfesion(adjPositivos));
// Utils.WriteLines('./FormarFrases/tests/test19.adjetivos_con_profesiones_enmascaradas_otros.test.tsv', generarTestAdjetivosConProfesionesEnmascaraProfesion(adjOtros));
// Utils.WriteLines('./FormarFrases/tests/test20.adjetivos_con_profesiones_enmascaradas_negativos.test.tsv', generarTestAdjetivosConProfesionesEnmascaraProfesion(adjNegativos));

console.log(dictEscrituras);