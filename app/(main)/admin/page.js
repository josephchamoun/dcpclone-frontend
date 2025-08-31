"use client";

import { useState } from "react";
import axios from "axios";
import styles from "@/styles/admin.module.css";

export default function WalletAdminPage() {
  const [loading, setLoading] = useState(false);
  const [fromUserId, setFromUserId] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = "http://127.0.0.1:8000/api"; 

  const getToken = () => localStorage.getItem("token");

  const handleSendFunds = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/wallet/send`,
        { from_user_id: fromUserId, to_address: toAddress, amount },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage(`✅ Sent successfully: ${JSON.stringify(res.data)}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSweepAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/sweepallwallets`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMessage(`✅ Sweep successful: ${JSON.stringify(res.data)}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetBalance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/wallet/balance`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMessage(`💰 Balance: ${res.data.balance}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Wallet Admin Panel</h1>

      <div className={styles.card}>
        <h2>Send Funds</h2>
        <input
          type="text"
          className={styles.input}
          placeholder="From User ID"
          value={fromUserId}
          onChange={(e) => setFromUserId(e.target.value)}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="To Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handleSendFunds}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Funds"}
        </button>
      </div>

      <div className={styles.card}>
        <h2>Sweep All Wallets</h2>
        <button
          onClick={handleSweepAll}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Processing..." : "Sweep All Funds"}
        </button>
      </div>

      <div className={styles.card}>
        <h2>Check My Balance</h2>
        <button
          onClick={handleGetBalance}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Balance"}
        </button>
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
