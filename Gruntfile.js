/**
 * Created by IMC017 on 2017-04-20.
 */
module.exports = function(grunt) {
    // 플러그인 로딩
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint',
        'grunt-exec',
    ].forEach(function(task){
        grunt.loadNpmTasks(task);
    });

    // 플러그인 설정
    grunt.initConfig({
        cafemocha: {
            all: {src : 'qa/tests-*.js', options : {ui: 'tdd'}, }
        },
        jshint: {
            app: ['server.js', 'public/js/**/*.js', 'lib/**/*.js'],
            qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
        },
    });

    // 작업 등록
    grunt.registerTask('default', ['cafemocha', 'jshint']);
};