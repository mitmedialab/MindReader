# ABOUT THE PROJECT:
Server side for the Mind Reader game.

Written in Typescript with Express.

Using Babel for Typescript conversion.

DB used: Mongo

# RUN ON PRODUCTION INFO:

## Sanity test for both server side and mogoDB:
curl 18.85.55.124:4300/results

It simulates get request to the server, and pulls the values from the db.

## Process to update production code:
    Convert from typescript to js (in "/home/readminds/mind_reader_server" folder):  
    
    npm run build 

    If doesn't work do:  pm2 restart server   or    pm2 start server.js 

#### test by running locally (not as service)  in "/home/readminds/mind_reader_server/dist"  :
    node server.js 

    
    
    
# Source for instructions:
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04 


# To play the game and more details:
http://web.media.mit.edu/~guysatat/MindReader/index.html    





# Check Databse

#### start by typing:
    mongo
    use MainDB
    


