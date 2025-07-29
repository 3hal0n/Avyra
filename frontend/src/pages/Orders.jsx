// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { Link } from "react-router-dom";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const setAuthHeader = () => {
//     const token = localStorage.getItem("jwtToken");
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       return true;
//     }
//     return false;
//   };


//   const fetchOrders = async () => {
//     try {
//       if (!setAuthHeader()) throw new Error("Not authenticated");
//       const res = await axios.get("http://localhost:8080/api/orders");
//       console.log("Orders API response:", res.data); // Debug log
  
//       if (Array.isArray(res.data)) {
//         setOrders(res.data);
//       } else if (res.data && typeof res.data === 'object') {
//         // If backend sends object with orders inside a property, e.g., { orders: [...] }
//         // adjust here accordingly, example:
//         setOrders(res.data.orders || []);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       setError("Failed to fetch your orders.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#12001b] to-[#141a33] text-white">
//       <Navbar />
//       <main className="max-w-5xl mx-auto px-6 pt-24 pb-10">
//         <h1 className="text-3xl font-bold mb-6">Your Orders 🧾</h1>
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : orders.length === 0 ? (
//           <p className="text-gray-400">You haven’t placed any orders yet.</p>
//         ) : (
//           <div className="space-y-6">
//             {orders.map(order => (
//               <div key={order.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
//                 <div className="flex justify-between mb-2">
//                   <h3 className="font-bold">
//                     <Link to={`/orders/${order.id}`} className="text-pink-400 underline">
//                       Order #{order.id}
//                     </Link>
//                   </h3>
//                   <span className="text-sm text-gray-400">
//                     {new Date(order.createdAt).toLocaleString()}
//                   </span>
//                 </div>
//                 <ul className="pl-5 list-disc space-y-1">
//                   {order.items?.map(item => (
//                     <li
//                       key={item.id?.gameId || item.game?.id || item.game?.title || Math.random()}
//                     >
//                       {item.game?.title || "Game"} — x{item.quantity} — $
//                       {item.priceAtPurchase?.toFixed(2)}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Orders;

// src/pages/Orders.jsx
import React from 'react';
import { downloadFile } from '../utils/downloadFile';

function getFilenameFromGameTitle(title) {
  return title.toLowerCase().replaceAll(/\s+/g, '_') + '.zip';
}

const Orders = ({ orders }) => {
  const token = localStorage.getItem('token');

  const handleDownload = async (filename) => {
    try {
      await downloadFile(filename, token);
    } catch (error) {
      alert(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">My Downloads</h2>
      {orders.length === 0 && <p>You have no downloads yet.</p>}
      {orders.map(order => (
        <div key={order.orderId} className="mb-6 border p-4 rounded shadow">
          <h3 className="font-bold mb-2">Order ID: {order.orderId}</h3>
          <ul>
            {order.items.map((item, idx) => {
              const filename = getFilenameFromGameTitle(item);
              return (
                <li key={idx} className="flex justify-between items-center mb-1">
                  <span>{item}</span>
                  <span className="text-green-600 font-semibold mr-4">Downloaded</span>
                  <button 
                    onClick={() => handleDownload(filename)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                  >
                    Download
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Orders;
