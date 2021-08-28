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
  WriteFileSyncRecursive(file, lines.join('\n'));
  //fs.writeFileSync(file, lines.join('\n'));
};

const WriteFileSyncRecursive = function(filename, content, charset = 'utf-8') {
  // -- normalize path separator to '/' instead of path.sep, 
  // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g,'/');  

  // -- preparation to allow absolute paths as well
  let root = '';
  if (filepath[0] === '/') { 
    root = '/'; 
    filepath = filepath.slice(1);
  } 
  else if (filepath[1] === ':') { 
    root = filepath.slice(0,3);   // c:\
    filepath = filepath.slice(3); 
  }

  // -- create folders all the way down
  const folders = filepath.split('/').slice(0, -1);  // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = acc + folder + '/';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      return folderPath
    },
    root // first 'acc', important
  ); 
  
  // -- write file
  fs.writeFileSync(root + filepath, content, charset);
}

const ReadTsv = function(file) {
  const lines = ReadLines(file)
      .map((l) => l.split('\t'));
  return lines;
};

const ReadJson = function(file){
  const rawdata = fs.readFileSync(file, 'utf8');
  return JSON.parse(rawdata);
}

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

// https://futurestud.io/tutorials/node-js-string-replace-all-appearances
const ReplaceAll = function(target, from, to) {
  const replacer = new RegExp(from, 'g');
  return target.replace(replacer, to);
};

export default {
  // File
  ReadLines,
  WriteLines,

  ReadTsv,
  ReadJson,

  // String
  Interpolate,
  FastInterpolate,
  ReplaceAll,
};
