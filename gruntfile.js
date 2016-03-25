/*global module, process, require */
module.exports = function (grunt) {

    var files = {
        'has-lf-github.js': 'http://blackbaud-line-endings.azurewebsites.net/has-lf.js',//'https://raw.githubusercontent.com/Blackbaud-BobbyEarl/line-endings/master/has-crlf.js',
        'has-lf-azure.js': 'http://blackbaud-line-endings.azurewebsites.net/deploy/has-lf.js'
    };

    grunt.initConfig({
        curl: files,
        sri: {
            crlf: {
                options: {
                    algorithms: ['sha384'],
                    dest: 'sri-crlf.json'
                },
                src: [
                    'has-crlf.js'
                ]
            },
            lf: {
                options: {
                    algorithms: ['sha384'],
                    dest: 'sri-lf.json'
                },
                src: [
                    'has-lf.js'
                ]
            }
        }
    });

    function characterCodeCount(code, src) {
        var len = src.length,
            i = 0,
            counter = 0;
        for (i; i < len; i++) {
            if (src.charCodeAt(i) === code) {
                counter++;
            }
        }
        return counter;
    }

    grunt.registerTask('compare', function () {
        var github = grunt.file.read('has-lf-github.js'),
            azure = grunt.file.read('has-lf-azure.js'),
            diff = github.length - azure.length,
            largerText,
            larger,
            smaller,
            largerI,
            largerLength;

        if (diff === 0) {
            console.log('Files are the same size!');
        } else {
            largerText = diff > 0 ? 'github' : 'azure';
            larger = diff > 0 ? github : azure;
            smaller = diff > 0 ? azure : github;
            console.log(largerText + ' is larger by ' + diff);

            largerI = 0;
            largerLength = larger.length;
            for (largerI; largerI < largerLength; largerI++) {
                console.log(largerI, larger[largerI], smaller[largerI]);
                // if (larger[largerI] !== smaller[largerI]) {
                //     console.log('FIRST MISMATCH AT ' + largerI);
                //     console.log(larger[largerI] + ' vs ' + smaller[largerI]);
                //     console.log(larger.charCodeAt(largerI) + ' vs ' + smaller.charCodeAt(largerI));
                //     break;
                // }
            }

            console.log(largerText + ' instances of 10: ' + characterCodeCount(10, larger));

        }

    });

    grunt.registerTask('clean', function () {
        Object.keys(files).forEach(function (file) {
            grunt.file.delete(file);
        });
    });

    grunt.registerTask('default', function () {
        var download = false;

        Object.keys(files).forEach(function (key) {
            if (!grunt.file.exists(key)) {
                download = true;
            }
        });

        if (download) {
            console.log('Downloading files');
            grunt.task.run('curl');
        }

        grunt.task.run('compare');
    });

    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-sri');
};
