<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solana Pay Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      background-color: #f0f0f0;
      margin: 0;
      padding: 50px;
      min-height: 100vh;
    }
    h1 {
      color: #333;
    }
    .wallet-button, .pay-button {
      padding: 12px 24px;
      font-size: 18px;
      margin: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .wallet-button {
      background-color: #6200ea;
      color: white;
    }
    .pay-button {
      background-color: #4CAF50;
      color: white;
    }
    .pay-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .status {
      margin-top: 20px;
      font-size: 16px;
      color: red;
    }
    .status.success {
      color: green;
    }
  </style>
</head>
<body>
  <h1>Solana Pay Demo</h1>
  <button class="wallet-button" onclick="connectWallet()">Connect Wallet</button>
  <p id="wallet-status">Wallet not connected</p>
  <button class="pay-button" id="pay-button" onclick="makePayment()" disabled>Pay 1 SOL</button>
  <p class="status" id="payment-status"></p>

  <script src="https://unpkg.com/@solana/web3.js@1.93.0/lib/index.iife.min.js"></script>
  <script src="https://unpkg.com/@solana/wallet-adapter-base@0.9.23/dist/index.js"></script>
  <script src="https://unpkg.com/@solana/wallet-adapter-wallets@0.19.32/dist/index.js"></script>
  <script src="https://unpkg.com/bignumber.js@9.1.2/bignumber.min.js"></script>
  <script>
    const { solana } = window;
    const { PublicKey, SystemProgram, Transaction } = window.SolanaWeb3;
    const { PhantomWalletAdapter } = window.SolanaWalletAdapterWallets;
    let wallet = null;
    const recipientAddress = 'gnsmrrUDxBe7F9rrWkN7EY51G7jMQsu1A8hnmx5JXmk';
    const connection = new SolanaWeb3.Connection('https://api.devnet.solana.com', 'confirmed');
    const amount = new BigNumber(1);

    async function connectWallet() {
      try {
        wallet = new PhantomWalletAdapter();
        await wallet.connect();
        document.getElementById('wallet-status').textContent = `Wallet connected: ${wallet.publicKey.toString()}`;
        document.getElementById('pay-button').disabled = false;
      } catch (error) {
        document.getElementById('wallet-status').textContent = 'Wallet connection failed';
        console.error('Connection error:', error);
      }
    }

    async function makePayment() {
      if (!wallet || !wallet.publicKey) {
        document.getElementById('payment-status').textContent = 'Please connect your wallet.';
        return;
      }

      try {
        document.getElementById('payment-status').textContent = 'Processing payment...';
        const recipient = new PublicKey(recipientAddress);
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: recipient,
            lamports: amount.times(1_000_000_000).toNumber(),
          })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        const { signature } = await wallet.signTransaction(transaction);
        const txid = await connection.sendRawTransaction(transaction.serialize());
        document.getElementById('payment-status').textContent = `Transaction sent: ${txid}`;

        await connection.confirmTransaction(txid, 'confirmed');
        document.getElementById('payment-status').textContent = '✅ Payment of 1 SOL successful!';
        document.getElementById('payment-status').classList.add('success');
      } catch (error) {
        document.getElementById('payment-status').textContent = `❌ Payment failed: ${error.message}`;
        console.error('Payment error:', error);
      }
    }
  </script>
</body>
</html>
