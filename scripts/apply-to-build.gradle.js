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
  
    if(!fs.existsSync(projectBuildFile)) {
      console.info(`Skipping: Root Android Gradle file not found - Android Platform not found or `)
    }

     try {
       let fileContents = fs.readFileSync(projectBuildFile, 'utf8');
  
       if (fileContents.indexOf(artifactVersion) < 0) {
         const myRegexp = /\bclasspath\b.*/g;
         let match = myRegexp.exec(fileContents);
         if (match != null) {
           let insertLocation = match.index + match[0].length;
      
           fileContents = `${fileContents.substr(0, insertLocation)}\n${dependency}${fileContents.substr(insertLocation)}`;
      
           fs.writeFileSync(projectBuildFile, fileContents, 'utf8');
      
           console.info(`updated ${projectBuildFile} to include dependency ${artifactVersion}`);
         } else {
           console.error(`unable to insert dependency ${artifactVersion}, could not find location to insert.`);
         }
       } else {
         console.info(`Dependency ${artifactVersion} already exists`);
       }
     }
     catch (e) {
       if (e instanceof Error) {
         if (e.code === 'ENOENT') {
//           This shouldn't occur because of the check before read.
//           Do nothing as this is possible if a different platform is initiated first.
//           console.log('File not found!');
           return;
         }
       }
       console.error(`An unexpected error has been thrown trying to add the ${artifactVersion} dependency: `, e);
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
