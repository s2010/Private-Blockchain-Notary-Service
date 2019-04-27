const SHA256 = require('crypto-js/sha256');
const Block = require('./block');
const BlockchainData = require('./blockchainData.js');


class Blockchain{
    constructor(db){
        this.chain = db || new BlockchainData("./chaindata");
        this.chain.isEmpty().then(result => {
            if(result) {
                console.log("Blockchain DB is empty, Creating new Blockchain with genesis block");
                this.addBlock(new Block("First block in the chain - Genesis block"));
            } 
            else {
                console.log("Blockchain DB has blocks, Reading Blockchain from DB");
            }
        }).catch(err => {
            throw err;
        });
    }
    getChain() {
        return console.log(this.chain);
    }
    addBlock(newBlock){
        let _this = this;
        return new Promise((resolve, reject) => {
            newBlock.time = new Date().getTime().toString().slice(0,-3);
            _this.chain.getChainLength().then(chainLength => {
                newBlock.height = chainLength;
                if(chainLength === 0) {
                    return new Promise((resolve, reject) => {
                        console.log("chain length = 0, return null instead of block");
                        resolve(null);
                    });
                } 
                else {
                    console.log(`chain length is ${chainLength}, return previous block`);
                    return _this.chain.getBlock(chainLength - 1);
                }
            }).then(previousBlock => {
                if(previousBlock === null) {
                    newBlock.previousBlockHash = "";
                } 
                else {
                    newBlock.previousBlockHash = previousBlock.hash;
                }
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                return _this.chain.saveBlock(newBlock);
            }).then(saveOperationResult => {
                console.log("block saved");
                resolve(saveOperationResult);
            }).catch(err => {
                reject(new Error(`${err.message}`));
            });
        });
    }
    getBlockHeight() {
        let _this = this;
        return  _this.chain.getChainLength(true);
    }
    getBlock(blockHeight){
        return new Promise((resolve, reject) => {
            this.chain.getBlock(blockHeight).then(block => {
                console.log(`Block hash : ${block.hash}`);
                resolve(block);
            }).catch(err => {
                console.log(`${err.message}`);
                reject(new Error(`${err.message}`));
            });
        });
    }
   
    validateBlock(blockHeight, checkPrevious=false){
        let _this = this;
        return new Promise(function(resolve, reject){
            _this.chain.getBlock(blockHeight).then(block => {
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    if(checkPrevious == true){
                        if(blockHeight == 0){ //Special case for genesis, previous hash must be empty
                            if(block.previousBlockHash === ""){
                                console.log(`Block is valid , Hash: ${validBlockHash}`);
                                resolve(true);
                            }
                            else{
                                reject(new Error('Block #'+blockHeight+' invalid previous hash:\n'+block.previousBlockHash+'<>'+previousBlock.hash));
                            }
                        }
                        else{
                            _this.chain.getBlock(blockHeight - 1).then(previousBlock => {
                                if(previousBlock.hash === block.previousBlockHash){
                                    console.log(`Block is valid , Hash: ${validBlockHash}`);
                                    resolve(true);
                                }
                                else {
                                    reject(new Error('Block #'+blockHeight+' invalid previous hash:\n'+block.previousBlockHash+'<>'+previousBlock.hash));
                                }
                            });
                        }
                    }
                    else{
                        console.log(`Block is valid , Hash: ${validBlockHash}`);
                        resolve(true);
                    }
                }
                 else {
                    reject(new Error('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash));
                }
            });
        });
    }
    validateChain() {
        let errors = [];
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.chain.getChainLength()
                .then(currentLength => {
                    let allBlockValidations = [];
                    for(let i = 0; i < currentLength; i++) {
                        allBlockValidations.push(
                            _this.validateBlock(i, true)
                                .catch(err => {
                                    errors.push(err);
                                })
                        );
                    }
                    return Promise.all(allBlockValidations);
                })
                .then(value => {
                    if(errors.length > 0) {
                        console.log(`Blockchain is not valid.`);
                        reject(errors);
                    } else {
                        console.log(`Blockchain is valid.`);
                        resolve(true);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

}
module.exports = Blockchain;