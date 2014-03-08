module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      js: {
        // entry point for app
        src: 'app/js/app.js',
        // compile to a single file
        dest: 'build/js/app.js',
      },
    },
    copy: {
      all: {
        // copy html and css into the build/ folder
        expand: true,
        cwd: 'app/',
        src: ['**/*.html', '**/*.css'],
        dest: 'build/',
      },
    },
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // The default tasks to run when you type: grunt
  grunt.registerTask('default', ['browserify', 'copy']);
};
