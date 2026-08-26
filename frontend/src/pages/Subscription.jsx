import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const plans = [
  { name: "Bronze", price: 100, tweets: 3 },
  { name: "Silver", price: 300, tweets: 5 },
  { name: "Gold", price: 1000, tweets: "Unlimited" },
];

function Subscription() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (planName) => {
    setMessage("");
    setLoading(true);
    try {
      // Step A: create mock order
      const orderRes = await API.post("/payment/create-order", { plan: planName });
      const { orderId } = orderRes.data;

      // Simulate a short "processing payment" delay like a real gateway popup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step B: verify mock payment
      const verifyRes = await API.post("/payment/verify-payment", {
        orderId,
        plan: planName,
      });

      setMessage(`✅ ${verifyRes.data.message}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Payment failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>← Back to Home</button>
      <h2>Choose Your Plan</h2>

      {message && (
        <p style={{ padding: "10px", background: "#222", borderRadius: "8px" }}>{message}</p>
      )}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {plans.map((p) => (
          <div
            key={p.name}
            style={{
              border: "1px solid #555",
              padding: "20px",
              borderRadius: "10px",
              flex: "1",
              minWidth: "150px",
            }}
          >
            <h3>{p.name}</h3>
            <p>₹{p.price}/month</p>
            <p>{p.tweets} tweets</p>
            <button
              onClick={() => handleSubscribe(p.name)}
              disabled={loading}
              style={{ width: "100%", padding: "8px", marginTop: "10px" }}
            >
              {loading ? "Processing..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>

      <p style={{ color: "gray", marginTop: "20px" }}>
        ⚠ Payments allowed only between 10:00 AM – 11:00 AM IST
      </p>
    </div>
  );
}

export default Subscription;