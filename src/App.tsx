import { BrowserRouter, Routes, Route } from "react-router-dom";
import MotorAP from "./pages/motorap";
import Upsell from "./pages/upsell";
import CarroAntigo from "./pages/carroantigo";
import Upsell_ca from "./pages/upsell_ca";
import AlemarcoMotor from "./pages/alemarcomotor";
import AlemarcoClassics from "./pages/alemarcoclassics"; 
import "./styles/alemarco-motor-landing.css";
import "./styles/alemarco-classics.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/motorap" element={<MotorAP />} />
        <Route path="/carroantigo" element={<CarroAntigo />} />
        <Route path="/upsell" element={<Upsell />} />
        <Route path="/upsell_ca" element={<Upsell_ca />} />
        <Route path="/alemarco-motor" element={<AlemarcoMotor />} />
        <Route path="/alemarco-classics" element={<AlemarcoClassics />} />

        {/* Opcional: rota principal */}
        <Route path="/" element={<MotorAP />} />
      </Routes>
    </BrowserRouter>
  );
}

