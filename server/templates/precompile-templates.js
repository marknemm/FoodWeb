const juice = require('juice');
const fs = require('fs-extra');
const path = require('path');

const srcTemplatesPath = path.join(__dirname);
const srcEmailTemplatesPath = path.join(srcTemplatesPath, 'email');
const srcEmailPartialsPath = path.join(srcEmailTemplatesPath, 'partials');
const srcEmailCssPath = path.join(srcEmailTemplatesPath, 'styles.css');

const distTemplatesPath = path.join(__dirname, '..', 'dist', 'server', 'templates');
const distEmailTemplatesPath = path.join(distTemplatesPath, 'email');
const distEmailPartialsPath = path.join(distEmailTemplatesPath, 'partials');

createTemplatesDistIfNotExist();
precompileTemplates();

function createTemplatesDistIfNotExist() {
  mkdirIfNotExist(distTemplatesPath);
  mkdirIfNotExist(distEmailTemplatesPath);
  mkdirIfNotExist(distEmailPartialsPath);
}

function mkdirIfNotExist(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function precompileTemplates() {
  const inlinesToPerform = genInlinesToPerform();
  inlinesToPerform.forEach(
    (inline) => inlineFileCss(inline.inTmplPath, inline.inCssPath, inline.outTmplPath)
  );
}

function genInlinesToPerform() {
  const inlinesToPerform = [];

  inlinesToPerform.push({
    inTmplPath: path.join(srcEmailTemplatesPath, 'email-container.hbs'),
    inCssPath: srcEmailCssPath,
    outTmplPath: path.join(distEmailTemplatesPath, 'email-container.hbs')
  });

  const partialFileNames = fs.readdirSync(srcEmailPartialsPath);
  partialFileNames.forEach((partialName) =>
    inlinesToPerform.push({
      inTmplPath: path.join(srcEmailPartialsPath, partialName),
      inCssPath: srcEmailCssPath,
      outTmplPath: path.join(distEmailPartialsPath, partialName)
    })
  );

  return inlinesToPerform;
}

function inlineFileCss(inTmplPath, inCssPath, outTmplPath) {
  const tmplToInline = fs.readFileSync(inTmplPath, 'utf8');
  const cssToInline = fs.readFileSync(inCssPath, 'utf8');
  const inlinedTmpl = juice.inlineContent(tmplToInline, cssToInline);
  // console.log('Inlined CSS "', inCssPath, '" into "', inTmplPath, '"');
  fs.writeFileSync(outTmplPath, inlinedTmpl);
}
