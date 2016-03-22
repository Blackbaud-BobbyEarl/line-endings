/*global module, process, require */
module.exports = function (grunt) {

    var files = {
        'libs-github.js': 'https://raw.githubusercontent.com/blackbaud/skyux/master/dist/js/libs.js',
        'libs-azure.js': 'http://blackbaud-skyux-releases-prod-line-endings.azurewebsites.net/skyux/1.5.12/js/libs.js'
    };

    grunt.initConfig({
        curl: files
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
        var github = grunt.file.read('libs-azure.js'),
            azure = grunt.file.read('libs-github.js'),
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
                if (larger[largerI] !== smaller[largerI]) {
                    console.log('FIRST MISMATCH AT ' + largerI);
                    console.log(larger[largerI] + ' vs ' + smaller[largerI]);
                    console.log(larger.charCodeAt(largerI) + ' vs ' + smaller.charCodeAt(largerI));
                    break;
                }
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

};
