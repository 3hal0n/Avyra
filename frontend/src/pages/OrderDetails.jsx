// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const OrderDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchOrder = async () => {
//     try {
//       const token = localStorage.getItem("jwtToken");
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       const res = await axios.get(`http://localhost:8080/api/orders/${id}`);
//       setOrder(res.data);
//     } catch (err) {
//       setError("❌ Failed to load order details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, [id]);

//   const total =
//     order?.items?.reduce(
//       (sum, i) => sum + i.quantity * i.priceAtPurchase,
//       0
//     ) || 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#160020] to-[#080015] text-white">
//       <Navbar />
//       <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
//         <h1 className="text-3xl font-bold mb-6">Order Details 🧾</h1>
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 shadow-xl">
//             <p className="mb-2 text-sm text-gray-400">
//               Placed on: {new Date(order?.createdAt).toLocaleString()}
//             </p>
//             <p className="text-pink-300 mb-4 font-semibold">
//               Order ID: {order?.id}
//             </p>

//             <ul className="space-y-2">
//               {order.items?.map((item, i) => (
//                 <li
//                   key={item.id?.gameId || item.game?.id || item.game?.title || i}
//                   className="flex justify-between border-b border-gray-700 pb-2"
//                 >
//                   <span>{item.game?.title}</span>
//                   <span>
//                     x{item.quantity} — ${item.priceAtPurchase.toFixed(2)}
//                   </span>
//                 </li>
//               ))}
//             </ul>

//             <p className="mt-4 text-lg font-bold text-green-400">
//               Total: ${total.toFixed(2)}
//             </p>

//             <button
//               onClick={() => generateInvoice(order, total)}
//               className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold"
//             >
//               📄 Download Invoice
//             </button>
//             <button
//               onClick={() => navigate("/orders")}
//               className="ml-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
//             >
//               🔙 Back to Orders
//             </button>
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default OrderDetails;

// function generateInvoice(order, total) {
//   const content = `
// INVOICE
// =======

// Order ID: ${order.id}
// Date: ${new Date(order.createdAt).toLocaleString()}

// Items:
// ${order.items
//     .map(
//       (i) => `${i.game?.title} x${i.quantity} = $${i.priceAtPurchase.toFixed(2)}`
//     )
//     .join("\n")}

// ------------------
// TOTAL: $${total.toFixed(2)}

// Thank you for shopping with us! 🎮
//   `.trim();

//   const blob = new Blob([content], { type: "text/plain" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = `order-${order.id}-invoice.txt`;
//   link.click();
// }

// src/pages/OrderDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { downloadFile } from '../utils/downloadFile';

function getFilenameFromGameTitle(title) {
  return title.toLowerCase().replaceAll(/\s+/g, '_') + '.zip';
}

const OrderDetails = ({ orders }) => {
  const { orderId } = useParams();
  const token = localStorage.getItem('token');

  const order = orders.find(o => o.orderId === orderId);

  if (!order) {
    return <div className="p-6">Order not found.</div>;
  }

  const handleDownload = async (filename) => {
    try {
      await downloadFile(filename, token);
    } catch (error) {
      alert(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Order Details: {order.orderId}</h2>
      <ul>
        {order.items.map((item, idx) => {
          const filename = getFilenameFromGameTitle(item);
          return (
            <li key={idx} className="flex justify-between items-center mb-2">
              <span>{item}</span>
              <span className="text-green-600 font-semibold mr-4">Downloaded</span>
              <button
                onClick={() => handleDownload(filename)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Download
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderDetails;
