

# Selective-ZKP EthIndia2k19 (Team nuAztec)

## Problem Statement        
In case of confidential transactions, the transaction value is visible only to participants of the transaction. 
1. What IF in an organization with various levels like CEO, VP, HR, Employees want to use confidential transactions with provision for selective view access to a group of people?
2. What IF in a closed auction using confidential transactions, once auction period is completed, the auction value must be revealed to a group of people?
3. What if Governments needs view access for Incometax returns calculation purpose of Crypto confidential transactions? ETC

There are numerous use cases like mentioned above where confidentiality is required with Selective Access Control [RBAC] which is not possible with currect confidential solutions.

<p align="center">
  <img src="logo.png">
</p>

## Solution
Selective-ZKP is a Decentralized platform for Role based access view of Confidential Assets created using Zero Knowledge Proofs. These Confidential Assets are created and transfered using Aztec Protocol. Confidential Assets are transfered as Notes[Similar to UTXO Model] in Aztec Protocol. Participants uses Viewing Key to fetch the transaction Value of Note. Viewing Key is shared only with the Participants of Transaction in Aztec Protocol.

### How does it work???
Our <i>Selective-ZKP</i> provision Note Owners to share the Viewing Key SELECTIVELY with Groups by creating Proxy on NuCypher. Once Proxy is created, Note owner can add public keys to the proxy. Now user can send message[ViewingKey] to the NuCyper proxy which creates re-encryption keys for all the public keys inside proxy group. Using re-encryption keys, Selective group can fetch the ViewingKey and subsequently fetch Note value.

We Selective-ZKP enhances Aztec Protocol helping users to provide view access to SELECTIVE clients.



## Flow
![Flow](Flow.png)

## How to run ?

1. Start the ganache cli on port 8545 by going into the `aztec_ganache_starter` folder, then run `npm install` to install dependencies and run `yarn start`
2. Open a new terminal and in the same folder run `yarn migrate`
3. Go to the `nucypher/setup` folder, install dependencies using `npm install` and run `node runner.js` which will start the nucypher entities
4. Then move to `nucypher/server` folder, install dependencies using `npm install` and run `node proxy.js` to connect to the nucypher entities
5. Now go to `aztec_ganache_starter` folder and run `node server/server.js`
6. Now run the UI server by going to `dashboard` folder, then installing live-server using `npm i -g live-server` and then running `live-server`.
7. You will find 2 pages `transfer` and `reg` when you go to `http://127.-0.0.1:8080`