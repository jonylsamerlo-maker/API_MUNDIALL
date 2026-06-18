import { NavLink, Route, Routes } from 'react-router-dom';
const logo = new URL('./imagen/super.jpeg', import.meta.url).href;
import Home from './pages/Home';
import Groups from './pages/Groups';
import Knockout from './pages/Knockout';
import Admin from './pages/Admin';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md transition ${isActive ? 'bg-slate-100 text-slate-950' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`;

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Mundial logo" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h1 className="text-2xl font-semibold">Mundial 2026 Fixture</h1>
              <p className="text-sm text-slate-400">MVP de consulta de partidos, grupos y eliminatorias</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Inicio
            </NavLink>
            <NavLink to="/grupos" className={navLinkClass}>
              Grupos
            </NavLink>
            <NavLink to="/eliminatorias" className={navLinkClass}>
              Eliminatorias
            </NavLink>
            <NavLink to="/admin" className={navLinkClass}>
              Cargar datos
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grupos" element={<Groups />} />
          <Route path="/eliminatorias" element={<Knockout />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
