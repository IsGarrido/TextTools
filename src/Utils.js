import fs from 'fs';

/*
    Carga un fichero separado por saltos de linea como un Array.
    Elimina lineas comentads y vacias
    Limpia y trimea cada linea
*/
const ReadLines = function(file) {
  const rawdata = fs.readFileSync(file, 'utf8');
  const lines = rawdata
      .split('\n')
      .filter( (x) => x[0] != '#' )
      .filter( (x) => x.trim() !== '' )
      .map( (x) => x.replace('\r', ''))
      .map( (l) => l.trim() );

  return lines;
};

const WriteLines = function(file, lines) {
  fs.writeFileSync(file, lines.join('\n'));
};

const ReadTsv = function(file) {
  const lines = ReadLines(file)
      .map((l) => l.split('\t'));
  return lines;
};

const Interpolate = (template, vars = {}) => {
  const handler = new Function('vars', [
    'const tagged = ( ' + Object.keys(vars).join(', ') + ' ) =>',
    '`' + template + '`',
    'return tagged(...Object.values(vars))',
  ].join('\n'));

  return handler(vars);
};

const FastInterpolate = function(template, replaces) {
  let t = template;
  for (const replace of replaces) {
    const target = '{'+replace[0]+'}';
    const value = replace[1];
    t = t.replace(target, value);
  }
  return t;
};


export default {
  // File
  ReadLines,
  WriteLines,

  ReadTsv,

  // String
  Interpolate,
  FastInterpolate,
};
