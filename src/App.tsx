import { BrowserRouter, Routes, Route } from "react-router-dom";
import MotorAP from "./pages/motorap";
import Upsell from "./pages/Upsell";
import CarroAntigo from "./pages/carroantigo";
import Upsell_ca from "./pages/Upsell_ca";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/motorap" element={<MotorAP />} />
        <Route path="/carroantigo" element={<CarroAntigo />} />
        <Route path="/upsell" element={<Upsell />} />
        <Route path="/upsell_ca" element={<Upsell_ca />} />

        {/* Opcional: rota principal */}
        <Route path="/" element={<MotorAP />} />
      </Routes>
    </BrowserRouter>
  );
}

