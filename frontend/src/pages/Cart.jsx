import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Checkout-specific state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  // Utility: Set Authorization header on axios from localStorage
  const setAuthHeader = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  };

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
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (gameId, newQuantity) => {
    if (newQuantity < 1) return;
    if (!setAuthHeader()) {
      setError("You must be logged in to update your cart.");
      return;
    }

    try {
      setUpdating(true);
      const oldItem = cartItems.find(item => item.gameId === gameId);
      if (!oldItem) return;
      const delta = newQuantity - oldItem.quantity;
      if (delta === 0) return;

      // Remove + re-add (instead of PATCH)
      await axios.delete(`http://localhost:8080/api/cart/${gameId}`);
      await axios.post(`http://localhost:8080/api/cart/${gameId}?quantity=${newQuantity}`);

      await fetchCartItems();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update cart.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (gameId) => {
    if (!setAuthHeader()) {
      setError("You must be logged in to update your cart.");
      return;
    }
    try {
      setUpdating(true);
      await axios.delete(`http://localhost:8080/api/cart/${gameId}`);
      await fetchCartItems();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to remove item.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = async () => {
    if (!setAuthHeader()) {
      navigate("/login");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);

    try {
      const response = await axios.post("http://localhost:8080/api/orders/checkout");

      const { orderId, message, createdAt } = response.data;
      setCheckoutSuccess({ orderId, message, createdAt });

      // Clear visually
      setCartItems([]);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Checkout failed. Try again.";
      setCheckoutError(msg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Redirect to login if not logged in
  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center text-white p-10">Loading your cart...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-10">
        <p>{error}</p>
        {!localStorage.getItem("jwtToken") && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  if (cartItems.length === 0 && !checkoutSuccess) {
    return (
      <div className="text-center text-white p-10">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {cartItems.length > 0 && (
        <>
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3">Title</th>
                <th className="text-right p-3">Price</th>
                <th className="text-center p-3">Quantity</th>
                <th className="text-right p-3">Total</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(({ gameId, title, price, quantity }) => (
                <tr key={gameId} className="border-b border-gray-700">
                  <td className="p-3">{title}</td>
                  <td className="p-3 text-right">${price.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      disabled={updating}
                      onChange={(e) =>
                        handleQuantityChange(gameId, parseInt(e.target.value, 10))
                      }
                      className="w-16 text-center rounded border border-gray-600 bg-gray-900 text-white"
                    />
                  </td>
                  <td className="p-3 text-right">${(price * quantity).toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <button
                      disabled={updating}
                      onClick={() => handleRemoveItem(gameId)}
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="text-right font-bold p-3">
                  Total:
                </td>
                <td className="text-right font-bold p-3">
                  ${totalPrice.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Checkout Section */}
          <div className="mt-6 flex justify-end">
            <button
              disabled={cartItems.length === 0 || updating || checkoutLoading}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded font-bold"
              onClick={handleCheckout}
            >
              {checkoutLoading ? "Processing..." : "🛒 Checkout"}
            </button>
          </div>
        </>
      )}

      {/* Checkout Error */}
      {checkoutError && (
        <div className="mt-4 text-red-500 font-semibold">{checkoutError}</div>
      )}

      {/* Checkout Success Summary */}
      {checkoutSuccess && (
        <div className="mt-6 bg-green-900 text-green-100 p-4 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-2">✅ Order Placed Successfully</h2>
          <p>🆔 <strong>Order ID:</strong> {checkoutSuccess.orderId}</p>
          <p>🛍 <strong>Message:</strong> {checkoutSuccess.message}</p>
          <p>📅 <strong>Date:</strong> {new Date(checkoutSuccess.createdAt).toLocaleString()}</p>

          <button
            onClick={() => navigate("/orders")}
            className="mt-4 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-semibold text-white"
          >
            View My Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
