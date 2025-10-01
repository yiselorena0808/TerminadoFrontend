import { Link } from "react-router-dom";

const Navbare: React.FC = () => {
  return (
    <nav className="bg-blue-700 text-white p-4 flex gap-6 shadow-md">
      <Link to="/cargos" className="hover:underline">Cargos</Link>
      <Link to="/productos" className="hover:underline">Productos</Link>
    </nav>
  );
};

export default Navbare;
