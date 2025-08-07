const { Keypair } = require('@solana/web3.js');
const fs = require('fs');

const keypair = Keypair.generate();
console.log('Public Key:', keypair.publicKey.toString());
console.log('Secret Key:', keypair.secretKey);

// Save to a file
fs.writeFileSync('keypair.json', JSON.stringify(Array.from(keypair.secretKey)));
console.log('Keypair saved to keypair.json');
