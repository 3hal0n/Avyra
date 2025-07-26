// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// const Cart = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState(false);

//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [checkoutSuccess, setCheckoutSuccess] = useState(null);
//   const [checkoutError, setCheckoutError] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   const setAuthHeader = () => {
//     const token = localStorage.getItem("jwtToken");
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       return true;
//     }
//     return false;
//   };

//   const fetchCartItems = async () => {
//     if (!setAuthHeader()) {
//       setError("You must be logged in to view your cart.");
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:8080/api/cart");
//       setCartItems(response.data);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to load cart.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const handleQuantityChange = async (gameId, newQuantity) => {
//     if (newQuantity < 1 || updating) return;
//     if (!setAuthHeader()) return;

//     try {
//       setUpdating(true);
//       await axios.delete(`http://localhost:8080/api/cart/${gameId}`);
//       await axios.post(`http://localhost:8080/api/cart/${gameId}`, null, {
//         params: { quantity: newQuantity },
//       });
//       await fetchCartItems();
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to update cart.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleRemoveItem = async (gameId) => {
//     if (!setAuthHeader()) return;
//     try {
//       setUpdating(true);
//       await axios.delete(`http://localhost:8080/api/cart/${gameId}`);
//       await fetchCartItems();
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to remove item.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleCheckout = async () => {
//     if (!setAuthHeader()) {
//       navigate("/login");
//       return;
//     }

//     setCheckoutLoading(true);
//     setCheckoutError(null);
//     setCheckoutSuccess(null);

//     try {
//       const res = await axios.post("http://localhost:8080/api/orders/checkout");
//       const { orderId, message, createdAt } = res.data;
//       setCheckoutSuccess({ orderId, message, createdAt });
//       setCartItems([]);
//     } catch (err) {
//       setCheckoutError(err.response?.data?.error || "Checkout failed.");
//     } finally {
//       setCheckoutLoading(false);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   useEffect(() => {
//     if (!localStorage.getItem("jwtToken")) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   return (
//     <div className="max-w-5xl mx-auto p-6 text-white">
//       <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

//       {loading ? (
//         <div className="text-center p-10">Loading your cart...</div>
//       ) : error ? (
//         <div className="text-center text-red-500 p-10">
//           <p>{error}</p>
//           {!localStorage.getItem("jwtToken") && (
//             <button
//               onClick={() => navigate("/login")}
//               className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
//             >
//               Go to Login
//             </button>
//           )}
//         </div>
//       ) : cartItems.length === 0 && !checkoutSuccess ? (
//         <div className="text-center text-white p-10">Your cart is empty.</div>
//       ) : (
//         <>
//           {cartItems.length > 0 && (
//             <>
//               <table className="w-full border-collapse border border-gray-700">
//                 <thead>
//                   <tr className="border-b border-gray-700">
//                     <th className="text-left p-3">Title</th>
//                     <th className="text-right p-3">Price</th>
//                     <th className="text-center p-3">Quantity</th>
//                     <th className="text-right p-3">Total</th>
//                     <th className="p-3">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cartItems.map(({ gameId, title, price, quantity }) => (
//                     <tr key={gameId} className="border-b border-gray-700">
//                       <td className="p-3">{title}</td>
//                       <td className="p-3 text-right">${price.toFixed(2)}</td>
//                       <td className="p-3 text-center">
//                         <input
//                           type="number"
//                           min={1}
//                           value={quantity}
//                           disabled={updating}
//                           onChange={(e) =>
//                             handleQuantityChange(gameId, parseInt(e.target.value, 10))
//                           }
//                           className="w-16 text-center rounded border border-gray-600 bg-gray-900 text-white"
//                         />
//                       </td>
//                       <td className="p-3 text-right">
//                         ${(price * quantity).toFixed(2)}
//                       </td>
//                       <td className="p-3 text-center">
//                         <button
//                           disabled={updating}
//                           onClick={() => handleRemoveItem(gameId)}
//                           className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   <tr>
//                     <td colSpan={3} className="text-right font-bold p-3">
//                       Total:
//                     </td>
//                     <td className="text-right font-bold p-3">
//                       ${totalPrice.toFixed(2)}
//                     </td>
//                     <td></td>
//                   </tr>
//                 </tbody>
//               </table>

//               {/* Checkout Button */}
//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={() => setShowPaymentModal(true)}
//                   disabled={cartItems.length === 0 || checkoutLoading}
//                   className="bg-green-600 hover:bg-green-700 px-6 py-2 font-bold rounded"
//                 >
//                   Proceed to Payment
//                 </button>
//               </div>
//             </>
//           )}

//           {/* Checkout Result or Error */}
//           {checkoutError && (
//             <div className="mt-4 text-red-400 font-bold">{checkoutError}</div>
//           )}
//           {checkoutSuccess && (
//             <div className="mt-6 bg-green-900 p-4 rounded text-green-200 shadow-md">
//               <h3 className="text-xl font-bold mb-2">✅ Order Successful</h3>
//               <p>
//                 Order ID: <b>{checkoutSuccess.orderId}</b>
//               </p>
//               <p>Placed on: {new Date(checkoutSuccess.createdAt).toLocaleString()}</p>
//               <p className="mt-2">{checkoutSuccess.message}</p>

//               <button
//                 className="mt-4 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-semibold"
//                 onClick={() => navigate("/orders")}
//               >
//                 View Orders
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Payment Modal */}
//       {showPaymentModal && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center">
//           <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-gray-700 shadow-xl text-white">
//             <h2 className="text-2xl font-bold mb-4">💳 Payment Details</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 setShowPaymentModal(false);
//                 handleCheckout();
//               }}
//               className="space-y-4"
//             >
//               <input
//                 type="text"
//                 required
//                 placeholder="Cardholder Name"
//                 className="w-full p-2 rounded bg-gray-800 border border-gray-600"
//               />
//               <input
//                 type="text"
//                 required
//                 placeholder="Card Number"
//                 className="w-full p-2 rounded bg-gray-800 border border-gray-600"
//               />
//               <div className="flex space-x-3">
//                 <input
//                   type="text"
//                   required
//                   placeholder="MM/YY"
//                   className="w-1/2 p-2 rounded bg-gray-800 border border-gray-600"
//                 />
//                 <input
//                   type="text"
//                   required
//                   placeholder="CVV"
//                   className="w-1/2 p-2 rounded bg-gray-800 border border-gray-600"
//                 />
//               </div>
//               <div className="flex justify-end gap-2 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowPaymentModal(false)}
//                   className="bg-gray-700 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={checkoutLoading}
//                   className="bg-green-600 px-5 py-2 rounded font-bold"
//                 >
//                   Pay $ {totalPrice.toFixed(2)}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = "AbP9TYp3pZoaXv7UG5aYkR3LhUIsgk8XD1tdpkCF_qacfbT_j4xM0cw9DN5B4RlPlrrkbjxBOPhFmtML"; // Replace this

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
      setError(err.response?.data?.error || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (gameId, newQuantity) => {
    if (newQuantity < 1 || updating) return;
    if (!setAuthHeader()) return;
    try {
      setUpdating(true);
      await axios.delete(`http://localhost:8080/api/cart/${gameId}`);
      await axios.post(`http://localhost:8080/api/cart/${gameId}`, null, {
        params: { quantity: newQuantity },
      });
      await fetchCartItems();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update cart.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (gameId) => {
    if (!setAuthHeader()) return;
    try {
      setUpdating(true);
      await axios.delete(`http://localhost:8080/api/cart/${gameId}`);
      await fetchCartItems();
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

  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      {loading ? (
        <div className="text-center p-10">Loading your cart...</div>
      ) : error ? (
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
      ) : cartItems.length === 0 && !checkoutSuccess ? (
        <div className="text-center text-white p-10">Your cart is empty.</div>
      ) : (
        <>
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
                            handleQuantityChange(
                              gameId,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-16 text-center rounded border border-gray-600 bg-gray-900 text-white"
                        />
                      </td>
                      <td className="p-3 text-right">
                        ${(price * quantity).toFixed(2)}
                      </td>
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
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={cartItems.length === 0 || checkoutLoading}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 font-bold rounded"
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          )}

          {checkoutError && (
            <div className="mt-4 text-red-400 font-bold">{checkoutError}</div>
          )}
          {checkoutSuccess && (
            <div className="mt-6 bg-green-900 p-4 rounded text-green-200 shadow-md">
              <h3 className="text-xl font-bold mb-2">✅ Order Successful</h3>
              <p>
                Order ID: <b>{checkoutSuccess.orderId}</b>
              </p>
              <p>
                Placed on:{" "}
                {new Date(checkoutSuccess.createdAt).toLocaleString()}
              </p>
              <p className="mt-2">{checkoutSuccess.message}</p>
              <button
                className="mt-4 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-semibold"
                onClick={() => navigate("/orders")}
              >
                View Orders
              </button>
            </div>
          )}
        </>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full border border-gray-700 shadow-xl text-white overflow-auto" style={{ minHeight: 600, maxHeight: "90vh" }}>
            <h2 className="text-2xl font-bold mb-4">💳 Payment Details</h2>
            <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
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
                  setCheckoutLoading(true);
                  try {
                    const token = localStorage.getItem("jwtToken");
                    const res = await axios.post(
                      "http://localhost:8080/api/orders/paypal-complete",
                      { orderID: data.orderID },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    setShowPaymentModal(false);
                    setCheckoutSuccess({
                      orderId: data.orderID,
                      message: res.data.message,
                      createdAt: new Date(),
                    });
                    setCartItems([]);
                    navigate("/success");
                  } catch (err) {
                    setCheckoutError("Order fulfillment failed.");
                  } finally {
                    setCheckoutLoading(false);
                  }
                }}
                onCancel={() => setShowPaymentModal(false)}
                onError={(err) => {
                  setCheckoutError("Payment error: " + String(err));
                  setShowPaymentModal(false);
                }}
              />
            </PayPalScriptProvider>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
