import './App.css';
import Header from './assets/js/components/Header';
import Main from './assets/js/components/Main';
import Footer from './assets/js/components/Footer';
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
