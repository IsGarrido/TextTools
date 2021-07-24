import fs, {write} from 'fs';

let writeTxt = function(filename, data){
    fs.writeFileSync('' + filename, data);
}

const interpolate = (template, vars = {}) => {
    const handler = new Function('vars', [
        'const tagged = ( ' + Object.keys(vars).join(', ') + ' ) =>',
        '`' + template + '`',
        'return tagged(...Object.values(vars))'
    ].join('\n'))
  
    return handler(vars)
}
  

class Palabra {
    constructor() {
        this.M = '';
        this.F = '';
    }

    fromArray(arr) {
        this.M = arr[0];
        this.F = arr[1];
        return this;
    }

    ok(){
        return this.M && this.F;
    }

    inspect(depth, opts) {
        return this.toString();
    }

    toString(){
        return this.M + '\t' + this.F;
    }
}

let uid = 0;
class TestMF {
    constructor(){
        this.Uid = uid++;
        this.M = '';
        this.F = '';
        this.TargetM = '';
        this.TargetF = '';
        this.TargetType = '';

        this.SourceDet = '';
        this.SourceName = '';
        this.SourceAdj = '';
    }

    build(template, determinante, nombre, adjetivo){

        this.SourceDet = determinante;
        this.SourceName = nombre;
        this.SourceAdj = adjetivo;

        if(adjetivo.M !== adjetivo.F) {
            this.TargetM = adjetivo.M;
            this.TargetF = adjetivo.F;
            this.TargetType = 'adjetivo';
        } else if(nombre.M !== nombre.F){
            this.TargetM = nombre.M;
            this.TargetF = nombre.F;
            this.TargetType = 'nombre';
        } else if (determinante.M !== determinante.F) {
            this.TargetM = determinante.M;
            this.TargetF = determinante.F;
            this.TargetType = 'determinante';
        } else {
            this.TargetType = '';
        }

        this.M = interpolate(
            template.M,
            {
                determinante: determinante.M !== this.TargetM ? determinante.M : '[MASK]',
                nombre: nombre.M != this.TargetM ? nombre.M : '[MASK]',
                adjetivo: adjetivo.M !== this.TargetM ? adjetivo.M: '[MASK]',
            });

        this.F = interpolate(
            template.M,
            {
                determinante: determinante.F !== this.TargetF ? determinante.F : '[MASK]',
                nombre: nombre.F != this.TargetF ? nombre.F : '[MASK]',
                adjetivo: adjetivo.F !== this.TargetF ? adjetivo.F: '[MASK]',
            });

            return this;    
    }

    toString(){
        return [this.Uid, this.M, this.F, this.TargetM, this.TargetF, this.TargetType, this.SourceDet, this.SourceName, this.SourceAdj].join('\t');
    }
}

class TestMFTarget extends TestMF {
    constructor(){
        this.Uid = uid++;
        this.M = '';
        this.F = '';
        this.TargetM = '';
        this.TargetF = '';
        this.TargetType = '';

        this.SourceDet = '';
        this.SourceName = '';
        this.SourceAdj = '';
    }

    build(template, determinante, nombre, adjetivo){

        this.SourceDet = determinante;
        this.SourceName = nombre;
        this.SourceAdj = adjetivo;

        if(adjetivo.M !== adjetivo.F) {
            this.TargetM = adjetivo.M;
            this.TargetF = adjetivo.F;
            this.TargetType = 'adjetivo';
        } else if(nombre.M !== nombre.F){
            this.TargetM = nombre.M;
            this.TargetF = nombre.F;
            this.TargetType = 'nombre';
        } else if (determinante.M !== determinante.F) {
            this.TargetM = determinante.M;
            this.TargetF = determinante.F;
            this.TargetType = 'determinante';
        } else {
            this.TargetType = '';
        }

        this.M = interpolate(
            template.M,
            {
                determinante: determinante.M !== this.TargetM ? determinante.M : '[MASK]',
                nombre: nombre.M != this.TargetM ? nombre.M : '[MASK]',
                adjetivo: adjetivo.M !== this.TargetM ? adjetivo.M: '[MASK]',
            });

        this.F = interpolate(
            template.M,
            {
                determinante: determinante.F !== this.TargetF ? determinante.F : '[MASK]',
                nombre: nombre.F != this.TargetF ? nombre.F : '[MASK]',
                adjetivo: adjetivo.F !== this.TargetF ? adjetivo.F: '[MASK]',
            });

            return this;    
    }

    toString(){
        return [this.Uid, this.M, this.F, this.TargetM, this.TargetF, this.TargetType, this.SourceDet, this.SourceName, this.SourceAdj].join('\t');
    }
}

// FILE
function ReadParts(file) {
    const path = './data/parts/' + file;
    const rawdata = fs.readFileSync(path, 'utf8');
    const lines = rawdata
        .split('\n')
        .filter( (x) => x[0] != '#' )
        .filter( (x) => x.trim() !== '' )
        .map( (x) => x.replace('\r', ''))
        .map( (l) => l.split('\t') )
        .map( (arr) => new Palabra().fromArray(arr) );

    const errores = lines.filter((x) => x.length == 1);
    if (errores.length > 0) {
        console.error(errores);
        throw 'Arreglar -> ' + errores;
    }

    return lines;
}

const determinantes = ReadParts('determinantes/singular.txt');
const nombres = ReadParts('nombres/singular.txt');
const adjNegativos = ReadParts('adjetivos/negativos.singular.txt');
const adjPositivos = ReadParts('adjetivos/positivos.singular.txt');
const adjOtros = ReadParts('adjetivos/otros.singular.txt');
const templates = ReadParts('templates.txt');

let positivos = [];
let negativos = [];
let otros = [];


for(let template of templates){
    for(let determinante of determinantes){
        for(let nombre of nombres){
            
            // Test 1
            // Positivos
            for(let adjetivo of adjPositivos){
                let test = new TestMF().build(template, determinante, nombre, adjetivo);
                positivos.push(test);
            }

            // Negativos
            for(let adjetivo of adjNegativos){
                let test = new TestMF().build(template, determinante, nombre, adjetivo);
                negativos.push(test);
            }

            // Otros
            for(let adjetivo of adjOtros){
                let test = new TestMF().build(template, determinante, nombre, adjetivo);
                otros.push(test);
            }

            // Test 2


        }
    }
}

console.log(positivos.length + "P", negativos.length + "N", otros.length + "O");

positivos = positivos.filter( x => x.TargetType != '')
negativos = negativos.filter( x => x.TargetType != '')
otros = otros.filter( x => x.TargetType != '')

console.log(positivos.length + "P", negativos.length + "N", otros.length + "O");

console.log("OK");
writeTxt('tests.positivos.txt', positivos.map(x => x.toString()).join('\n'));
writeTxt('tests.otros.txt', otros.map(x => x.toString()).join('\n'));
writeTxt('tests.negativos.txt', negativos.map(x => x.toString()).join('\n'));

