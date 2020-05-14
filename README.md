As a pressed coin collector for 10+ years and a lifetime Disney fan, I dislike how there is no efficient and official way to keep trach of my coins through the official Disneyland app, or by printing a paper and manually checking them off. 

<b> What needs to be done: </b>
~ * Need to implement check boxes so that users can check off which coins they collected ~
* DOCUMENTATION!! and cleaning up the code 
* Allow users to register and save their progress 
* Add all coin locations for the Disney parks in Anaheim, California and Orlando, Florida



<b>Please reach out to me if you are interested in seeing the presentation I created for this project!</b>

Check out a sneak peek of the map demo: 
<img src = "readmeimages/mapdemo.png">

----------------------------------
Revisited this project in 2020.  need to provide proper documemntation for myself lol

1. To run locally, type ```nodemon``` or ```node app.js``` to boot up program 
2. when running locally, need .env file. check out my notes on db/index.js to know what to delete 
3. UnhandledPromiseRejectionWarning: error: password authentication failed for user "diane"



----------------------------------
Steps for reinstallation / running on a new machine:
1. Currently running well on node version 10.2.0. 
    - run ```nvm use 10.2.0``` 
2. Need to install redis accordingly. it is advised to boot up redis automatically
3. Probably lacking a connection to the psql DB
    - if you get the error: Error: Redis connection to 127.0.0.1:6379 failed - connect ECONNREFUSED 127.0.0.1:6379
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1161:14)
    - then you must....
        a) start psql 
        b) make sure you create database pennydb if not done already 
        c) otherwise, create db, then run psql file 
        d) this should work 
    

----------------------------------
References:
<b>Understanding Google  Maps API</b>
<b> LINKS USED: </b> 
* https://developers.google.com/maps/documentation/javascript/adding-a-google-map

<b>Understanding psql</b>
because i had no idea what to do 90% of the time 

* type "sudo -iu postgres" to change user in unix (ex/ diane@diane --> postgres@diane)
--if no db exist, create "pennydb" to run this file 

<b> LINKS USED: </b> 
* https://stackoverflow.com/questions/27777076/accidently-removed-postgres-default-superuser-privileges-can-i-get-it-back/27778321
* https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
* To understand relational databases: https://launchschool.com/books/sql_first_edition/read/multi_tables


<b> Understanding Cookies: </b>
<b> LINKS USED: </b>
* https://www.w3schools.com/js/js_cookies.asp

<b>Other things I learned</b>
* run ```ps aux | grep node``` to kill ports when the same port error comes up 
* working on a new branch
    - ```git branch``` shows what branch you are on
    - ```git switch BRANCH_NAME_HERE``` to switch to another branch
    - to merge 2 branches
        - git checkout BRANCH_NAME_HERE
        - git merge master
        - git push origin BRANCH_NAME_HERE
