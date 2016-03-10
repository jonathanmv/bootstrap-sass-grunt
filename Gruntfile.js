/* jshint node: true */
/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
              ' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Bootstrap requires jQuery\') }\n\n',

    // Task configuration.
    clean: {
      init: {
        src: [
          'bootstrap-sass'
        ]
      },
      dist: {
        src: 'dist'
      }
    },

    jshint: {
      options: {
        jshintrc: 'configs/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'assets/js/*.js'
      }
    },

    csslint: {
      options: {
        csslintrc: 'configs/.csslintrc'
      },
      src: [
        'dist/css/bootstrap-theme.css'
      ]
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'assets/js/bootstrap.min.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    uglify: {
      bootstrap: {
        options: {
          banner: '<%= banner %>',
          report: 'min'
        },
        src: '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    // This is for Ruby-based SASS compilation
    sass: {
      dev: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'dist/css/<%= pkg.name %>-theme.css': 'assets/scss/theme.scss'
        }
      },
      dist: {                            // Target
        options: {                       // Target options
          style: 'compressed'
        },
        files: {                         // Dictionary of files
          'dist/css/<%= pkg.name %>-theme.css': 'assets/scss/theme.scss'
        }
      }
    },

    //This is for LibSASS Support when it becomes available.
    // sass: {
    //   dev: {
    //     options: {
    //       includePaths: ['assets/stylesheets/'],
    //       sourceComments: 'normal'
    //     },
    //     files: {
    //       'dist/css/<%= pkg.name %>.css': 'assets/stylesheets/bootstrap.scss',
    //       'dist/css/main.css': 'assets/stylesheets/main.scss',
    //       'dist/css/<%= pkg.name %>-theme.css': 'assets/stylesheets/theme.scss'
    //     }
    //   },
    //   dist: {
    //     options: {
    //       includePaths: ['assets/stylesheets/'],
    //       outputStyle:'compressed'
    //     },
    //     files: {
    //       'dist/css/<%= pkg.name %>.css': 'assets/stylesheets/bootstrap.scss',
    //       'dist/css/main.css': 'assets/stylesheets/main.scss',
    //       'dist/css/<%= pkg.name %>-theme.css': 'assets/stylesheets/theme.scss'
    //     }
    //   }
    // },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            'dist/css/<%= pkg.name %>.css',
            'dist/css/<%= pkg.name %>.min.css',
            'dist/css/<%= pkg.name %>-theme.css',
            'dist/css/<%= pkg.name %>-theme.min.css',
          ]
        }
      }
    },

    csscomb: {
      sort: {
        options: {
          config: 'configs/.csscomb.json'
        },
        files: {
          'dist/css/<%= pkg.name %>-theme.css': 'dist/css/<%= pkg.name %>-theme.css'
        }
      }
    },

    copy: {
      init: {
        files: [
          {
            expand: true,
            cwd: 'bootstrap-sass/assets/',
            src: ['fonts/**/*'],
            dest: 'assets'
          },
          {
            expand: true,
            cwd: 'bootstrap-sass/assets/javascripts/',
            src: ['**/*'],
            dest: 'assets/js'
          },
          {
            expand: true,
            cwd: 'bootstrap-sass/assets/stylesheets/',
            src: ['**/*'],
            dest: 'assets/scss'
          },
          {
            expand: true,
            cwd: 'bootstrap-sass/assets/stylesheets/',
            src: ['_theme.scss'],
            dest: 'assets/scss/',
            rename: function(dest, src) {
              return dest + 'theme.scss';
            }
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: './assets/fonts/',
            src: ['**/*'],
            dest: 'dist/css'
          },
          {
            expand: true,
            cwd: './assets/vendor/',
            src: ['**/*'],
            dest: 'dist/vendor'
          }
        ]
      }
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src']
      },
      sass: {
        files: 'assets/scss/*.scss',
        tasks: 'sass'
      }
    }

  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // JS development task.
  grunt.registerTask('dev-js', ['concat:bootstrap']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS development task.
  grunt.registerTask('dev-css', ['sass:dev', 'csscomb', 'usebanner']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['sass:dist', 'usebanner']);

  // Full development task.
  grunt.registerTask('dev', ['clean:dist', 'dev-css', 'copy:dist', 'dev-js']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'copy:dist', 'dist-js']);

  grunt.registerTask('scaffold-bootstrap', ['copy:init'/*, 'clean:init'*/]);

  // Default task.
  grunt.registerTask('default', ['dev']);

};
