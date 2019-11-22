# dr-scrapelove
A web-scraping app using Handlebars Mongoose &amp; Cheerio

## Index
1. Problem it solves
2. How it works
3. Instructions
4. Built with

## Problem it solves
If you've ever wanted to take notes on what you've read, this app will help. It uses the Cheerio npm package to scrape data from freeCodeCamp's news page(a wonderful place for tutorials and knowledge) and present that content in as similar fashion as possible, with the only change being that the user can create and save notes for each article. 

## How it works
The app scrapes a given news site (although it will need to be updated for each site as html markup will be different) using the Cheerio and Axios npm packages. Using a Mongo database, the app then stores BSON objects for each article, then uses express and mongoose to serve that data to a handlebars html template. Routes then handle the creation, storing, and deleting of user notes. Future updates will include a mobile-responsive design, and the logic allowing users to email themselves a link to a given article with the notes associated with that article.

## Instructions
Take notes on the amazing tutorials and articles available on freeCodeCamp! 

If you'd like to setup a local copy, fork this repo and clone it to your computer; load that entire folder into VS Code (or your preferred editor), and from that directory, run  
```sh
npm install
``` 
to install the packages and dependencies(in this case: mongoose, handlebars, express, axios and cheerio). [Install Mongo>](https://docs.mongodb.com/manual/installation/) and start a Mongo database. Finally, edit the server.js file with your local database credentials.  

OR! [Demo the app on heroku>](https://shrouded-springs-77789.herokuapp.com/)

## Built with
* [Node](https://nodejs.org/en/) - Asynchronous, single-threaded js runtime environment
### npm packages
* [express](https://www.npmjs.com/package/express) - API framework
* [Mongoose](https://www.npmjs.com/package/mongoose) - node.js driver for Mongo databases
* [handlebars](https://www.npmjs.com/package/express-handlebars) - html templating engine
* [axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and node.js
* [cheerio](https://www.npmjs.com/package/method-override) - API for maniupulating a data structure
