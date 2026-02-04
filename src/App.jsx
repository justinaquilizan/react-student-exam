import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import Home from './pages/Home';
import Students from './pages/Students';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <HeaderComponent />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
