const http = require('axios');
const request = require("request");
const config = require("../config.json");
const cors = require('cors');


const grantAccess = (bob_encrypting_key, bob_verifying_key, policyName, m, n, expiry) => {
    console.log(bob_encrypting_key, bob_verifying_key, policyName, m, n, expiry);
    return http.put(`${config.ALICE_URL}/grant`, {
        bob_encrypting_key,
        label: policyName,
        m,
        n,
        "expiration": expiry,
        bob_verifying_key
    }).then((response) => {
        return response.data;
    });
}

const createPolicy = (policyName) => {
    return http.post(`${config.ALICE_URL}/derive_policy_encrypting_key/${policyName}`).then((response) => {
        return response.data;
    });
}

const encryptMessage = (msg) => {
    return http.post(`${config.ENRICO_URL}/encrypt_message`, {
        message: msg
    }).then((response) => {
        return response.data;
    });
}

const retreiveMessage = (bobIndex, alice_verifying_key, policy_encrypting_key, policyName, encryptedMsg) => {
    console.log(bobIndex, alice_verifying_key, policy_encrypting_key, policyName, encryptedMsg);
    return http.post(`${config.BOB_IP}:${4000+bobIndex}/retrieve`, {
        policy_encrypting_key,
        alice_verifying_key,
        label: policyName,
        message_kit: encryptedMsg
    }).then((response) => {
        return response.data;
    });
}

const revokeAccess = (bob_verifying_key, policyName) => {
    return http.delete(`${config.ALICE_URL}/revoke`, {
        data: JSON.stringify({
            bob_verifying_key,
            label: policyName
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if(!response.data.result.failed_revocations) {
            return true;
        } else {
            return false;
        }
    });
}

module.exports = {
    grantAccess,
    revokeAccess,
    createPolicy,
    encryptMessage,
    retreiveMessage
}