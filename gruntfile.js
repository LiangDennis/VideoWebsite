module.exports =function (grunt) {

    // 所有的任务都会经过这里
    grunt.initConfig({
        watch: {
            jade: {
                files: ["views/**"],//加s
                options: {
                    livereload: true//有改动重启服务
                }
            },
            js: {
                files: ["bower_components/js/**", "models/**/*.js", "schema/**/*.js"],
                // tasks: ["jshint"],
                options: {
                    livereload: true
                }
            }
        },
        // dev是开发环境
        nodemon: {
            dev: {
                script:"app.js",//将app.js放在此处
                options: {
                    // file: "app.js",//不加s
                    args: [],
                    ignoredFiles: ["README.md", "node_modules/**", ".DS_Store"],
                    watchedExtendsions: ["js"],
                    watchedFolders: ["app", "config"],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT:3000
                    },
                    // cwd: _dirname
                }
            }
        },

        // 能重新执行nodemon,和watch
        concurrent: {
            tasks: ["nodemon","watch"],
            options: {
                logConcurrentOutput:true
            }
        }
    });  
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-nodemon"); 
    grunt.loadNpmTasks("grunt-concurrent"); 
    

    //不要因为语法的错误警告而中断任务，需要加上--force，而不是force
    grunt.option("--force",true);
    grunt.registerTask("default",["concurrent"]);//注册一个默认的任务
}