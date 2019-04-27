const express = require('express');
const bodyParser = require('body-parser');
const BlockchainService = require('./blockchain.js');
const BlockController = require('./blockController.js');
const BlockchainData = require('./blockchainData.js');

// initialize express app
const app = express();
const port = 8000;

// Insantiating 
let blockchainData = new BlockchainData("./chaindata");
let blockchainService = new BlockchainService(blockchainData);
let blockController = new BlockController(blockchainService);

// setting the port
app.set("port", port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/block/:index', blockController.getBlockByIndex.bind(blockController));
app.post('/block', blockController.postNewBlock.bind(blockController));

// 2nd Rubric Point: API Service Port Configuration - use port 8000 with localhost URL
app.listen(app.get("port"), () => {
	console.log(`Server Listening for port: ${app.get("port")}`);
});
