import fs from 'fs'
//import { argv } from 'process';
import process from 'process';

const genreFile = "./data/Diccionario/MasculinoFemenino/rae-generos.txt"

function w(file, content){
    fs.writeFileSync(file, content)
}

function Run(){

    let genresArr = fs
        .readFileSync(genreFile, 'utf-8')
        .split("\n")
        .map(x => x.split("\t"));

    let genreMF = {};
    genresArr.forEach(x => genreMF[x[0]] = x[1]);
        
    const inputFile = process.argv.splice(2,1)[0];
    console.log(inputFile);
    const outputFile = inputFile.replace(".txt", ".output.txt");

    let inputArr = fs
    .readFileSync(inputFile, 'utf-8')
    .split("\n")
    .map(x => x.trim());

    let output = [];
    inputArr.forEach(masc => {
        let fem = genreMF[masc];
        if( fem !== undefined)
            output.push( masc + "\t" + fem);
        else
            output.push( masc + "\t");
    });


    w(outputFile, output.join("\n"));

}


Run();