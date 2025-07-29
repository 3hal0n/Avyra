import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const PAYPAL_CLIENT_ID ="AQI0v2iVOX7LKr4xDLL2eH6pKKrj-G2aXGQFByWp4w3B9m73fqL6_mfzAdP5Ii1ujVhQK3rlJkNERmAc";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Set JWT token header on axios default
  const setAuthHeader = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  };

  // Fetch user's cart items
  const fetchCartItems = async () => {
    if (!setAuthHeader()) {
      setError("You must be logged in to view your cart.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/cart");
      setCartItems(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Handle quantity changes for cart items
  const handleQuantityChange = async (gameId, newQuantity) => {
    if (newQuantity < 1 || updating) return;
    if (!setAuthHeader()) return;
    try {
      setUpdating(true);
      await axios.delete(`http://localhost:8080/api/cart/${gameId}`);
      await axios.post(
        `http://localhost:8080/api/cart/${gameId}`,
        null,
        { params: { quantity: newQuantity } }
      );
      await fetchCartItems();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update cart.");
    } finally {
      setUpdating(false);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (gameId) => {
    if (!setAuthHeader()) return;
    try {
      setUpdating(true);
      await axios.delete(`http://localhost:8080/api/cart/${gameId}`);
      await fetchCartItems();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove item.");
    } finally {
      setUpdating(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Redirect to login if no token
  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <style>{`
        /* Your neon flicker & styling CSS exactly as provided earlier */
        /* ... [omitted for brevity, keep your existing styles here] ... */
      `}</style>

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <NavBar />
        <main className="flex-grow p-6 max-w-6xl mx-auto overflow-auto">
          <h1 className="text-4xl font-extrabold mb-8 tracking-wide neon-flicker select-none">
            Cart
          </h1>

          {loading ? (
            <div className="text-center py-20 neon-flicker text-xl">
              Loading your cart...
            </div>
          ) : error ? (
            <div className="error-neon max-w-xl mx-auto">
              <p>{error}</p>
              {!localStorage.getItem("jwtToken") && (
                <button
                  onClick={() => navigate("/login")}
                  className="btn-neon mt-6 px-6 py-3 w-full rounded font-mono tracking-wide text-lg"
                >
                  Go to Login
                </button>
              )}
            </div>
          ) : cartItems.length === 0 && !checkoutSuccess ? (
            <div className="text-center neon-flicker text-2xl font-semibold py-20">
              Your cart is empty.
            </div>
          ) : (
            <>
              {cartItems.length > 0 && (
                <>
                  <div className="overflow-x-auto rounded-lg border border-purple-800 shadow-lg shadow-purple-700/50">
                    <table className="w-full border-collapse table-neon min-w-[720px]">
                      <thead>
                        <tr>
                          <th className="text-left p-4">TITLE</th>
                          <th className="text-right p-4">PRICE</th>
                          <th className="text-center p-4">QUANTITY</th>
                          <th className="text-right p-4">TOTAL</th>
                          <th className="p-4 text-center">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map(({ gameId, title, price, quantity }) => (
                          <tr
                            key={gameId}
                            className="transition-colors duration-300 hover:bg-purple-900/20"
                          >
                            <td className="p-4 font-semibold text-cyan-300">
                              {title}
                            </td>
                            <td className="p-4 text-right font-mono tracking-wide text-green-400">
                              ${price.toFixed(2)}
                            </td>
                            <td className="p-4 text-center text-black">
                              <input
                                type="number"
                                min={1}
                                value={quantity}
                                disabled={updating}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    gameId,
                                    parseInt(e.target.value, 10)
                                  )
                                }
                                className="input-neon w-16 text-center rounded-xl font-bold text-lg"
                              />
                            </td>
                            <td className="p-4 text-right font-mono font-semibold text-pink-500">
                              ${(price * quantity).toFixed(2)}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                disabled={updating}
                                onClick={() => handleRemoveItem(gameId)}
                                className="btn-neon rounded-xl px-5 py-2 font-semibold tracking-widest hover:scale-105 transform transition duration-200 select-none"
                                aria-label={`Remove ${title} from cart`}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-purple-700 font-extrabold text-right text-2xl bg-gradient-to-r from-purple-900 to-purple-700/40">
                          <td
                            colSpan={3}
                            className="p-4 pr-8 uppercase tracking-wide select-none"
                          >
                            Total
                          </td>
                          <td className="p-4 pr-8 font-mono tracking-widest text-pink-400">
                            ${totalPrice.toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      disabled={cartItems.length === 0 || checkoutLoading}
                      className="btn-neon bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 font-bold rounded-2xl tracking-wide uppercase hover:from-pink-500 hover:to-purple-400 transition-transform duration-300 transform hover:scale-110 select-none shadow-[0_0_15px_#f0f]"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </>
              )}

              {checkoutError && (
                <div className="error-neon max-w-xl mx-auto mt-6">
                  {checkoutError}
                </div>
              )}
              {checkoutSuccess && (
                <div className="success-neon max-w-xl mx-auto mt-6 p-6">
                  <h3 className="text-2xl font-extrabold mb-4 tracking-widest">
                    ✅ Order Successful
                  </h3>
                  <p>
                    Order ID: <b>{checkoutSuccess.orderId}</b>
                  </p>
                  <p>
                    Placed on:{" "}
                    {new Date(checkoutSuccess.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 italic">{checkoutSuccess.message}</p>
                  
                  <button
                    className="btn-neon mt-6 w-full py-3 rounded-xl font-bold text-lg"
                    onClick={async () => {
                      const token = localStorage.getItem("jwtToken");
                      const gameTitle = cartItems?.[0]?.title || "game"; // Fallback title
                      const filename =
                        gameTitle.toLowerCase().replace(/\s+/g, "_") + ".zip";

                      try {
                        const response = await fetch(
                          `http://localhost:8080/api/downloads/${filename}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        if (!response.ok) {
                          throw new Error("Download failed");
                        }

                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        alert(`Download failed: ${error.message}`);
                      }
                    }}
                  >
                    ⬇️ Download Game
                  </button>
                </div>
              )}
            </>
          )}

          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center px-4 py-8">
              <div className="glassmorphic-bg relative max-w-3xl w-full p-8 overflow-auto max-h-[90vh] shadow-[0_0_40px_#0ff] select-none">
                <h2 className="text-3xl font-extrabold mb-6 text-cyan-400 tracking-widest text-center drop-shadow-[0_0_10px_cyan]">
                  💳Payment Gateway
                </h2>

                <PayPalScriptProvider
                  options={{ "client-id": PAYPAL_CLIENT_ID }}
                >
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      shape: "rect",
                      color: "blue",
                      label: "pay",
                    }}
                    disabled={checkoutLoading}
                    forceReRender={[totalPrice]}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: totalPrice.toFixed(2),
                              currency_code: "USD",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      console.log("PayPal onApprove data:", data);
                      setCheckoutLoading(true);
                      setCheckoutError(null);

                      try {
                        // Capture the payment
                        console.log("Capturing PayPal order...");
                        const details = await actions.order.capture();
                        console.log("PayPal capture details:", details);

                        if (details.status !== "COMPLETED") {
                          throw new Error(
                            `Payment was not completed. Status: ${details.status}`
                          );
                        }

                        // Send the payment confirmation to your backend
                        const token = localStorage.getItem("jwtToken");

                        console.log(
                          "Sending payment confirmation to backend..."
                        );
                        const payload = {
                          orderID: data.orderID,
                          details: details, // Send the entire details object
                          cartItems: cartItems, // Include cart items for order creation
                          totalAmount: totalPrice,
                        };

                        console.log("Backend payload:", payload);

                        const response = await axios.post(
                          "http://localhost:8080/api/orders/paypal-complete",
                          payload,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                          }
                        );

                        console.log("Backend response:", response.data);

                        // Success - update UI
                        setShowPaymentModal(false);
                        setCheckoutSuccess({
                          orderId: data.orderID,
                          message:
                            response.data.message ||
                            "Order placed successfully!",
                          createdAt: new Date(),
                        });
                        setCartItems([]);

                        // Optional: Navigate to success page
                        navigate("/success", { state: { gameTitle: cartItems[0]?.title } });

                      } catch (error) {
                        console.error("Payment approval failed:", error);

                        let errorMessage =
                          "Order fulfillment failed. Please try again.";

                        if (error.response) {
                          // Backend returned an error
                          console.error(
                            "Backend error response:",
                            error.response.data
                          );
                          errorMessage =
                            error.response.data.error ||
                            error.response.data.message ||
                            errorMessage;
                        } else if (error.request) {
                          // Network error
                          console.error("Network error:", error.request);
                          errorMessage =
                            "Network error. Please check your connection and try again.";
                        } else {
                          // Other error
                          console.error("Error:", error.message);
                          errorMessage = error.message;
                        }

                        setCheckoutError(errorMessage);
                      } finally {
                        setCheckoutLoading(false);
                      }
                    }}
                    onCancel={(data) => {
                      console.log("PayPal payment cancelled:", data);
                      setShowPaymentModal(false);
                    }}
                    onError={(err) => {
                      console.error("PayPal payment error:", err);
                      setCheckoutError("Payment error: " + String(err));
                      setShowPaymentModal(false);
                    }}
                  />
                </PayPalScriptProvider>

                <div className="flex justify-center pt-8">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="btn-neon px-6 py-3 rounded-xl font-bold tracking-wider hover:scale-110 transition-transform duration-300 select-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Cart;