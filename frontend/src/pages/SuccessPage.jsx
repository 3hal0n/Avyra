// SuccessPage.js
export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-4xl font-bold mb-6 text-green-700">Payment Successful!</h1>
      <p className="text-lg text-green-600 mb-4">Thank you for your purchase. Your order is confirmed.</p>
      <a href="/orders" className="text-blue-500 underline">View my orders</a>
    </div>
  );
}
