module.exports = function(grunt) {

  grunt.initConfig({
    clean: ['public/'],
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'static/', src:['**'], dest: 'public/'}
        ]
      }
    },
    browserify: {
      dev : {
        src:  'views/jsx/*.jsx',
        dest: 'public/js/App.js',
        options: {
          watch: true,     // use watchify for incremental builds
          keepAlive: true, // watchify will exit unless task is kept alive
          transform: ["babelify"],
          browserifyOptions: {
            debug: true // source maps
          },
        },
      },
      dist: {
        src:  'views/jsx/App.jsx',
        dest: 'public/js/App.js',
        options: {
          transform: ["babelify"]
        }
      }
    },
    'http-server': {
      'dev': {
        root: 'public/',
        port: 8080
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-browserify')
  grunt.registerTask('default', ['copy','browserify:dev']);
  grunt.registerTask('dist', ['clean','copy','browserify:dist']);
  grunt.registerTask('build', ['dist']);
};
