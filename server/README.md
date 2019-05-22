ABOUT THE PROJECT:
Server side for the Mind Reader game.
Written in Typescript with Express.
Using Babel for Typescript conversion.
DB used: Mongo

RUN ON PRODUCTION INFO:

Source for instructions:
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04 

Sanity test for both server side and mogoDB:
curl localhost:4300/results
It simulates get request to the server, and pulls the values from the db.

The process in production after updating the code:
 -convert from typescript to js (in "/home/readminds/mind_reader_server" folder):  
    npm run build 
-run locally (not as service)  in "/home/readminds/mind_reader_server/dist"  :
    node server.js 
-run as service using pm2 ("server" is our generated service name):
    pm2 start server 
    
    
To play the game and more details:
http://web.media.mit.edu/~guysatat/MindReader/index.html    



