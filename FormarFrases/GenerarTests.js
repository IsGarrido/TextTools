import Utils from '../src/Utils.js';
import BERT from '../src/BERT.js';

class Repository {
    
    constructor(){
        this.load();
    }

    load(){
        this.plantillas = Utils.ReadLines('./data/Plantillas/plantillas.txt');
        this.genero = [['el', 'ella']/*, ['Juan', 'Juana'], ['Mario', 'María']*/];
        this.profesion = Utils.ReadTsv('./input/cno/profesiones.handpicked.output.no_spaces.txt');
        this.determinante = Utils.ReadTsv('./data/Partes/determinantes/singular.txt');
        this.nombre = Utils.ReadTsv('./data/Partes/nombres/nombres.tsv');

        this.adjetivonegativo = Utils.ReadTsv('./data/Partes/adjetivos/negativos.singular.txt');
        this.adjetivopositivo = Utils.ReadTsv('./data/Partes/adjetivos/positivos.singular.txt');
        this.adjetivootros = Utils.ReadTsv('./data/Partes/adjetivos/otros.singular.txt');
        this.adjetivocolores = Utils.ReadTsv('./data/Partes/adjetivos/colores.txt');
    }

    getM(type){
        return this[type].flatMap( x => x[0]);
    }

    getF(type){
        return this[type].flatMap( x => x[1])
    }

    getPlantillas(){
        return this.plantillas;
    }
}

let Data = new Repository();

function Parse(str){
    if(!str.includes(":"))
        return undefined;

    let parts = str.split(":");
    return {
        type: parts[0],
        mask: parts[1],
        item: str
    }
}

function GenerateMixed(template) {

    let origM = [template];
    let origF = [template];

    let maskedM = [template];
    let maskedF = [template];
    
    let oddsM = [template];
    let oddsF = [template];

    let targetWordsM = [''];
    let targetWordsF = [''];

    let parts = template.split(' ');
    for(let part of parts){
        let parsed = Parse(part);

        if(!parsed)
            continue;

        // 1. Para la frase original se reemplaza todo
        let targetsM = Data.getM(parsed.type);
        let targetsF = Data.getF(parsed.type);

        origM = ReplaceExpandTemplate(origM, parsed.item, targetsM);
        origF = ReplaceExpandTemplate(origF, parsed.item, targetsF);

        // 2. Para la enmascarada se reemplaza m1 por mask y el resto por su valor
        if(parsed.mask == "m1"){
            maskedM = ReplaceExpandWithMASK(maskedM, parsed.item, targetsM);
            maskedF = ReplaceExpandWithMASK(maskedF, parsed.item, targetsF);
        }
        else if(parsed.mask == "m2" || parsed.mask == "m"){

            maskedM = ReplaceExpandTemplate(maskedM, parsed.item, targetsM);
            maskedF = ReplaceExpandTemplate(maskedF, parsed.item, targetsF);
        }

        // 3. Para log odds se reemplaza todo
        oddsM = ReplaceExpandWithMASK(oddsM, parsed.item, targetsM);
        oddsF = ReplaceExpandWithMASK(oddsF, parsed.item, targetsF);
        
        // 4. Palabras target originales
        targetWordsM = ExpandTarget(targetWordsM, targetsM);
        targetWordsF = ExpandTarget(targetWordsF, targetsF);


    }
    return FormaterSalida([targetWordsM, targetWordsF, origM, origF, maskedM, maskedF, oddsM, oddsF]);

}

function FormaterSalida(items){
    let res = Array(items[0].length)
    .fill(0)
    .map((_, idx) => [
        items[0][idx],
        items[1][idx],
        items[2][idx],
        items[3][idx],
        items[4][idx],
        items[5][idx],
        items[6][idx],
        items[7][idx],
    ] )
    .map( x => x.join("\t") );

    return res;
}

function ExpandTarget(sentences, values){
    return sentences.flatMap( sentence => values.map( val => val) );
}

function ReplaceExpandWithMASK(sentences, key, values){
    return sentences.flatMap( sentence => values.map( val => sentence.replace(key, BERT.MASK)) );
}

function ReplaceExpandTemplate(sentences, key, values){
    return sentences.flatMap( sentence => values.map( val => sentence.replace(key, val)) );
}

function GenerateAll(templates){
    templates.forEach( template => {
        let res = GenerateMixed(template);
        let file = template.split(" ").join("_").split(":").join("-");
        Utils.WriteLines("./FormarFrases/test_auto/" + file + ".test.tsv", res);
    } );
}

GenerateAll(Data.getPlantillas())

