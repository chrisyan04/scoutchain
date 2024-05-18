"use client";

import React, { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";

export default function Test() {
  const { connect, keyStores, WalletConnection } = nearAPI;
  const [myKeyStore, setMyKeyStore] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Not connected");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      setMyKeyStore(new keyStores.BrowserLocalStorageKeyStore());
    }
  }, []);

  const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://testnet.nearblocks.io",
  };

  useEffect(() => {
    if (myKeyStore) {
      const connectToNear = async () => {
        try {
          const nearConnection = await connect({
            ...connectionConfig,
            keyStore: myKeyStore,
          });
          // @ts-ignore
          const walletConnection = new WalletConnection(nearConnection, "testing");
          console.log("Wallet connection:", walletConnection);
          const url = await walletConnection.requestSignInUrl({
            contractId: "yanner.testnet",
          });
          setConnectionStatus("Connected");
          console.log("URL:", url);
          if (walletConnection.isSignedIn()) {
            const walletAccountId = walletConnection.getAccountId();
            const walletAccountObj = walletConnection.account();
            console.log("Wallet account object:", walletAccountObj);

            const accountBalance = await walletAccountObj.getAccountBalance();
            console.log("Account balance:", accountBalance);

            const receiverId = walletAccountId;
            const amount = BigInt(10);
            const result = await walletAccountObj.sendMoney(receiverId, amount);
            console.log("Transaction result:", result);

            console.log("Account balance:", accountBalance);
          }
        } catch (error) {
          console.log("Error connecting to NEAR:", error);
          setConnectionStatus("Failed to connect");
        }
      };
      connectToNear();
    }
  }, [myKeyStore]);

  return (
    <div>
      <div>{connectionStatus}</div>
      <div></div>
    </div>
  );
}