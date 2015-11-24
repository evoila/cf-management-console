module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/lib/angular/angular.js',
      'app/lib/angular-route/angular-route.js',
      'app/lib/angular-aria/angular-aria.js',
      'app/lib/angular-mocks/angular-mocks.js',
      'app/lib/angular-material/angular-material.js',
      'app/components/**/*.js',
      'app/view*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
