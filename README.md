# Steps to set up project: 
 Propertypalsearch for properties 
 This is a cypress test application
- Clone project from
```
-git clone https://github.com/hkrk1805/propertypalsearch.git
```
-Open project in visualcode

-open terminal and navigate to the cloned repo location

# Install node and cypress with following command at the location

# install the node_modules
```
npm install
```
# install cypress 
```
npm install cypress --save-dev
```
# install cuccumber plugin
```
$ npm install cucumber
```
- add the following code in the index.js file
```
const cucumber = require('cypress-cucumber-preprocessor').default;
 module.exports = (on, config) => {
on('file:preprocessor', cucumber());
}
```
# Now to run the scripts
run the following command in the terminal which will open the cypress runner with .feature file 
```
npm run test
```
cypress runner window open with feature file click on feature file will run the scripts
