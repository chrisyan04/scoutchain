'use client'

import React, { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";
import { Button, Spinner, Input } from "@nextui-org/react";
// @ts-ignore
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Test() {
  const { connect, keyStores, WalletConnection } = nearAPI;
  const [myKeyStore, setMyKeyStore] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Not connected");
  const [loading, setLoading] = useState(false);
  const [walletAccountObj, setWalletAccountObj] = useState(null);
  const [receiverId, setReceiverId] = useState("");

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

  const sendMoney = async () => {
    try {
      setLoading(true);
      const amount = BigInt(1000000000000000000000);
      // @ts-ignore
      const result = await walletAccountObj.sendMoney(receiverId, amount);
      console.log("Transaction result:", result);
      toast.success("Money sent successfully!");
    } catch (error) {
      console.error("Error sending money:", error);
      toast.error("Error sending money!");
    } finally {
      setLoading(false);
    }
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
          const walletConnection = new WalletConnection(
            nearConnection,
            "testing"
          );
          console.log("Wallet connection:", walletConnection);
          const url = await walletConnection.requestSignInUrl({
            contractId: "yanner.testnet",
          });
          setConnectionStatus("Connected");
          console.log("URL:", url);
          if (walletConnection.isSignedIn()) {
            const walletAccountId = walletConnection.getAccountId();
            const walletAccount = walletConnection.account();
            console.log("Wallet account object:", walletAccount);

            const accountBalance = await walletAccount.getAccountBalance();
            console.log("Account balance:", accountBalance);

            // @ts-ignore
            setWalletAccountObj(walletAccount);
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
      <div>
        <span className="text-[#d4af37]">{"yanner.testnet: "}</span>
        <span
          className={
            connectionStatus === "Connected"
              ? "text-[#00ff00]"
              : "text-[#ff0000]"
          }
        >
          {connectionStatus}
        </span>
      </div>
      {/* <Input
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        placeholder="Enter receiver's ID"
      /> */}
      {/* <Button
        onClick={sendMoney}
        disabled={loading || !walletAccountObj || !receiverId}
      >
        {loading ? (
          <Spinner color="default" className="invert" size="sm" />
        ) : (
          "Send Money"
        )}
      </Button>
      <ToastContainer /> */}
    </div>
  );
}
