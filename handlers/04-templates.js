// no templates in ctx example
const pug = require('pug');

exports.init = app => app.use(async (ctx, next) => {
  // in the future we'll extend this
  ctx.render = (templatePath, locals) => {
    return pug.renderFile(templatePath, locals);
  };

  await next();
});
