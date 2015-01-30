'use strict';
var plugin = {};
plugin.attach = function(gulp, config) {
  require('./workflow/build').attach(gulp, config);
  require('./workflow/css').attach(gulp, config);
  require('./workflow/dependencies').attach(gulp, config);
  require('./workflow/deploy').attach(gulp, config);
  require('./workflow/js').attach(gulp, config);
  require('./workflow/test').attach(gulp, config);
  require('./workflow/workflow').attach(gulp, config);
};
module.exports = plugin;
