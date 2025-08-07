import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useState } from 'react';

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  const recipientAddress = 'gnsmrrUDxBe7F9rrWkN7EY51G7jMQsu1A8hnmx5JXmk';
  const amount = new BigNumber(1);

  const handlePayment = async () => {
    if (!publicKey) {
      setPaymentStatus('Please connect your wallet.');
      return;
    }

    try {
      setPaymentStatus('Processing payment...');

      const recipient = new PublicKey(recipientAddress);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount.times(1_000_000_000).toNumber(),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      setPaymentStatus(`Transaction sent: ${signature}`);

      await connection.confirmTransaction(signature, 'confirmed');
      setPaymentStatus('✅ Payment of 1 SOL successful!');
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus(`❌ Payment failed: ${error.message}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Solana Pay Demo</h1>
      <WalletMultiButton />
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handlePayment}
          disabled={!publicKey}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: publicKey ? 'pointer' : 'not-allowed',
          }}
        >
          Pay 1 SOL
        </button>
      </div>
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
}
