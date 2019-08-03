## Team - nuAztec
# Selective-ZKP EthIndia2k19

## Problem Statement
In case of confidential transactions, the transaction value is visible only to participants of the transaction. 
1. What if in an organization with various roles like CEO, 
2. What if Governments needs view access for Incometax returns calculation purpose ??
2. 


## Solution
Selective-ZKP is a Decentralized platform for Role based access view of Confidential Assets created using Zero Knowledge Proofs. These Confidential Assets are created and transfered using Aztec Protocol. Confidential Assets are transfered as Notes[Similar to UTXO Model] in Aztec Protocol. Participants uses Viewing Key to fetch the transaction Value of Note. Viewing Key is shared only with the Participants of Transaction in Aztec Protocol.

### How does it work???
We Selective-ZKP provision Note Owners to share the Viewing Key SELECTIVELY with Groups by creating Proxy on NuCypher. Once Proxy is created, Note owner can add public keys to the proxy. Now user can send message[ViewingKey] to the NuCyper proxy which creates re-encryption keys for all the public keys inside proxy group. Using re-encryption keys, Selective group can fetch the ViewingKey and subsequently fetch Note value.

We Selective-ZKP enhances Aztec Protocol helping users to provide view access to SELECTIVE clients.



## Flow
![Flow](Flow.png)
