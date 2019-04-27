# Project #4 Private Blockchain Notary Service
In this project, we'll build a Star Registry service that allows users to claim ownership of their favorite star in the night sky.

To do this, we'll add functionality to the Web API you built in Project 3: Web Services. We will connect this web service to our own private blockchain, allowing users to notarize ownership of a digital asset, in this case whichever star they choose.

## Prerequisites

You need to have setup following frameworks on your machine before running this project:

```
- bitcoinjs-lib@4.0.2
- bitcoinjs-message@2.0.0
- joi@14.0.4
- crypto-js@3.1.9-1
- body-parser@1.18.3
- express@4.16.4
- level@4.0.0
``

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

1. Download or clone this repo to a local folder on your machine
    
     `git clone https://github.com/s2010/Private-Blockchain-with-RESTful-Web-API.git`

2. Open terminal (MAC/linux) or command prompt (windows variants) on your desktop and navigate to the project path.
3. Run `npm install` to install dependencies from package.json
4. Run `node app.js`
5. Server should listen on port 8000 (make sure this port should remain free to test this).you should see some lines as following:
 
        Server Listening for port: 8000
        Blockchain DB is empty. Creating new Blockchain with 1 genesis block...
        chain length = 0, return null instead of block
        block saved