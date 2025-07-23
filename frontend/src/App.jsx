import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
      <Footer />
    </main>
  );
}

export default App;
