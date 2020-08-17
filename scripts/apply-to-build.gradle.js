/***
 *
 * FROM: https://stackoverflow.com/questions/51078719/add-classpath-to-build-gradle-in-cordova-plugin
 ***/
 const fs = require('fs');
 const path = require('path');

 function addProjectLevelDependency(platformRoot) {
     const artifactVersion = 'com.google.firebase:perf-plugin:1.3.1';
     const dependency = `        classpath '${artifactVersion}'`;

     const projectBuildFile = path.join(platformRoot, 'build.gradle');

     let fileContents = fs.readFileSync(projectBuildFile, 'utf8');
     
     if (fileContents.indexOf(artifactVersion) < 0) {
       const myRegexp = /\bclasspath\b.*/g;
       let match = myRegexp.exec(fileContents);
       if (match != null) {
         let insertLocation = match.index + match[0].length;
    
         fileContents = `${fileContents.substr(0, insertLocation)}\n${dependency}${fileContents.substr(insertLocation)}`;
    
         fs.writeFileSync(projectBuildFile, fileContents, 'utf8');
    
         console.log(`updated ${projectBuildFile} to include dependency ${artifactVersion}`);
       } else {
         console.error(`unable to insert dependency ${artifactVersion}`);
       }
     } else {
       console.error(`Dependency ${artifactVersion} already exists`);
     }
 }

 module.exports = context => {
     "use strict";
     const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');

     return new Promise((resolve, reject) => {
         addProjectLevelDependency(platformRoot);
         resolve();
     });
 };
