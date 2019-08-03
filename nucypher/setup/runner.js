const { exec } = require("child_process");
const http = require('axios');
const fs = require('fs');

const URSULA_URL = "localhost:10151";
const policyName = "admin";
let alicePortIndex = 3000;
let bobPortIndex = 4000;
let enricoPortIndex = 5000;
const util = require("../lib/util");
const config = {
    "Alice": {},
    "Bob": {},
    "Enrico": {}
}

// Alice is an admin who creates the policies
const startAlice = (alicePort) => {
    return new Promise((resolve, reject) => {
        const handle = exec(`nucypher alice run --teacher ${URSULA_URL} --dev --federated-only --controller-port ${alicePort}`, (err, stdout, stderr) => {
            console.log(`Node ${alicePort}: ${stdout}`);
        });
        handle.stdout.on('data', (data) => {
            console.log(`Alice Node ${alicePort}: ${data}`);
            if(!config["Alice"][alicePort-3000]) {
                config["Alice"][alicePort-3000] = {};
            }
            if(data.includes("Encrypting")) {
                config["Alice"][alicePort-3000].encryption_key = data.match(/[0-f]{66}/g)[0];
            } else if(data.includes("Verifying")) {
                config["Alice"][alicePort-3000].verification_key = data.match(/[0-f]{66}/g)[0];
            }
        })
    });
};

const startBob = (bobPort) => {
    return new Promise((resolve, reject) => {
        const handle = exec(`nucypher bob run --teacher ${URSULA_URL} --dev --federated-only --controller-port ${bobPort}`, (err, stdout, stderr) => {
            console.log(`Node ${bobPort}: ${stdout}`);
            resolve();
        });
        handle.stdout.on('data', (data) => {
            console.log(`Bob Node ${bobPort}: ${data}`);
            if(!config["Bob"][bobPort-4000]) {
                config["Bob"][bobPort-4000] = {};
            }
            if(data.includes("Encrypting")) {
                config["Bob"][bobPort-4000].encryption_key = data.match(/[0-f]{66}/g)[0];
            } else if(data.includes("Verifying")) {
                config["Bob"][bobPort-4000].verification_key = data.match(/[0-f]{66}/g)[0];
            }
        })
    });
};

const startEnrico = (enricoPort, policyEncryptingKey) => {
    return new Promise((resolve, reject) => {
        const handle = exec(`nucypher enrico run --http-port ${enricoPort} --policy-encrypting-key ${policyEncryptingKey}`, (err, stdout, stderr) => {
            console.log(`Node ${enricoPort}: ${stdout}`);
            resolve();
        });
        handle.stdout.on('data', (data) => {
            console.log(`enrico Node ${enricoPort}: ${data}`);
            if(!config["Enrico"][enricoPort-5000]) {
                config["Enrico"][enricoPort-5000] = {};
            }
            if(data.includes("Encrypting")) {
                config["Enrico"][enricoPort-5000].encryption_key = data.match(/[0-f]{66}/g)[0];
            } else if(data.includes("Verifying")) {
                config["Enrico"][enricoPort-5000].verification_key = data.match(/[0-f]{66}/g)[0];
            }
        })
    });
};

const startUrsula = () => {
    return new Promise((resolve, reject) => {
        const handle = exec(`nucypher ursula run --dev --federated-only`, (err, stdout, stderr) => {
            console.log(`Ursula : ${stdout}`);
            resolve();
        });
        handle.stdout.on('data', (data) => {
            console.log(`Ursula : ${data}`);
        })
    });
}

const createPolicy = (aliceUrl, policyName) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const resp = await http.post(`${aliceUrl}/derive_policy_encrypting_key/${policyName}`);
            config.policy_encrypting_key = resp.data.result.policy_encrypting_key;
            resolve(resp.data.result.policy_encrypting_key);
        }, 5000);
    });
}

const setPolicy = (policyName) => {
    // TODO - setup the policy by granting access to relavent parties
    return util.grantAccess(config["Bob"][0].encryption_key, config["Bob"][0].verification_key, policyName, 1, 1, "2020-09-15T15:20:00");
}

const runner = async (noOfBob) => {
    startUrsula();
    
    startAlice(alicePortIndex);

    for(let i = 0; i < noOfBob; i++) {
        startBob(bobPortIndex);
        bobPortIndex++;
    }

    const policyEncryptingKey = await createPolicy(`http://localhost:${alicePortIndex}`, policyName);
    fs.writeFileSync("../ports.json", JSON.stringify(config, null, 2));
    await setPolicy(policyName);
    console.log("Policy Encrypting Key : ", policyEncryptingKey);
    startEnrico(enricoPortIndex, policyEncryptingKey);
};

runner(2);
// createPolicy(`http://localhost:${alicePortIndex}`, policyName);