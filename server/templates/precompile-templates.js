const fs = require('fs-extra');
const juice = require('juice');
const path = require('path');

// Generate template src paths.
const srcTemplatesPath = path.join(__dirname);
const srcEmailTemplatesPath = path.join(srcTemplatesPath, 'email');
const srcEmailPartialsPath = path.join(srcEmailTemplatesPath, 'partials');
const srcEmailCssPath = path.join(srcEmailTemplatesPath, 'styles.css');

// Generate template dist paths.
const serverRoot = path.join(__dirname, '..');
const distPath = path.join(serverRoot, 'dist');
const distServerPath = path.join(distPath, 'server');
const distTemplatesPath = path.join(distServerPath, 'templates');
const distEmailTemplatesPath = path.join(distTemplatesPath, 'email');
const distEmailPartialsPath = path.join(distEmailTemplatesPath, 'partials');

// Perform precompilation workflow.
createTemplatesDistIfNotExist();
precompileTemplates();
copyResultToAdminDist();

/**
 * Creates precompiled template dist directories if they do not exist.
 */
function createTemplatesDistIfNotExist() {
  mkdirIfNotExist(distPath);
  mkdirIfNotExist(distServerPath);
  mkdirIfNotExist(distTemplatesPath);
  mkdirIfNotExist(distEmailTemplatesPath);
  mkdirIfNotExist(distEmailPartialsPath);
}

/**
 * Creates a given directory path if it does not exist.
 * @param {string} path The directory path to create.
 */
function mkdirIfNotExist(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

/**
 * Precompiles HTML templates by inlining CSS via juice.
 */
function precompileTemplates() {
  const inlinesToPerform = genInlinesToPerform();
  inlinesToPerform.forEach(
    (inline) => inlineFileCss(inline.inTmplPath, inline.inCssPath, inline.outTmplPath)
  );
}

/**
 * Generates data describing the template CSS inlines that should be performed.
 * @return {any[]} A list of data structures describing the inlines that should be performed.
 */
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

/**
 * Inlines the CSS for a given template.
 * @param {string} inTmplPath The pathname of the template to inline CSS for.
 * @param {string} inCssPath The pathname of the CSS that shall be inlined.
 * @param {string} outTmplPath The pathname of the output template result.
 */
function inlineFileCss(inTmplPath, inCssPath, outTmplPath) {
  const tmplToInline = fs.readFileSync(inTmplPath, 'utf8');
  const cssToInline = fs.readFileSync(inCssPath, 'utf8');
  const inlinedTmpl = juice.inlineContent(tmplToInline, cssToInline);
  fs.writeFileSync(outTmplPath, inlinedTmpl);
}

/**
 * Copies the template precompile result from /dist to /admin-dist if it exists for dev mode.
 */
function copyResultToAdminDist() {
  const adminDistServerPath = distServerPath.replace('/dist', '/admin-dist');
  const adminDistTemplatesPath = path.join(adminDistServerPath, 'templates');
  if (fs.existsSync(adminDistServerPath)) {
    fs.copySync(distTemplatesPath, adminDistTemplatesPath, { overwrite: true });
  }
}
