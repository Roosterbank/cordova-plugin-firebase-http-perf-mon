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

     try {
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
     catch (e) {
       if (e instanceof Error) {
         if (e.code === 'ENOENT') {
//           Do nothing as this is possible if a different platform is initiated first.
//           console.log('File not found!');
           return;
         }
       }
       throw err;
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
