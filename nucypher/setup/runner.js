const { exec } = require("child_process");
const http = require('axios');

const URSULA_URL = "localhost:10151";
const policyName = "admin";
let alicePortIndex = 3000;
let bobPortIndex = 4000;
let enricoPortIndex = 5000;

// Alice is an admin who creates the policies
const startAlice = (alicePort) => {
    return new Promise((resolve, reject) => {
        const handle = exec(`nucypher alice run --teacher ${URSULA_URL} --dev --federated-only --controller-port ${alicePort}`, (err, stdout, stderr) => {
            console.log(`Node ${alicePort}: ${stdout}`);
        });
        handle.stdout.on('data', (data) => {
            console.log(`Alice Node ${alicePort}: ${data}`);
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
            resolve(resp.data.result.policy_encrypting_key);
        }, 5000);
    });
}

const setPolicy = (aliceUrl, policyName) => {
    // TODO - setup the policy by granting access to relavent parties
}

const runner = async (noOfBob) => {
    startUrsula();
    
    startAlice(alicePortIndex);

    for(let i = 0; i < noOfBob; i++) {
        startBob(bobPortIndex);
        bobPortIndex++;
    }

    const policyEncryptingKey = await createPolicy(`http://localhost:${alicePortIndex}`, policyName);
    console.log("Policy Encrypting Key : ", policyEncryptingKey);
    startEnrico(enricoPortIndex, policyEncryptingKey);
};

runner(2);
// createPolicy(`http://localhost:${alicePortIndex}`, policyName);