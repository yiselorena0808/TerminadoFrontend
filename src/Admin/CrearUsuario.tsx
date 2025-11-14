import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Webcam from "react-webcam";

interface ModalRegistroUsuarioProps {
  onClose: () => void;
  onUsuarioCreado: () => void;
}

const RegistrarUsuario: React.FC<ModalRegistroUsuarioProps> = ({
  onClose,
  onUsuarioCreado,
}) => {
  const webcamRef = useRef<Webcam>(null);

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_empresa: "",
    id_area: "",
    nombre: "",
    apellido: "",
    nombre_usuario: "",
    correo_electronico: "",
    cargo: "",
    contrasena: "",
    confirmacion: "",
  });
  const [isSGVA, setIsSGVA] = useState(false);
  const [metodoHuella, setMetodoHuella] = useState<
    "camara" | "huellero" | "archivo" | ""
  >("");
  const [huella, setHuella] = useState<string | null>(null);

  // APIs (sin modificar)
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiRegisterSGVA = import.meta.env.VITE_API_REGISTROSGVA;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;

  // Cargar empresas
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch(apiEmpresas);
        const data = await res.json();
        setEmpresas(Array.isArray(data.datos) ? data.datos : []);
      } catch (error) {
        console.error("Error cargando empresas:", error);
      }
    };
    fetchEmpresas();
  }, []);

  // Cargar áreas según empresa
  useEffect(() => {
    const fetchAreas = async () => {
      if (!formData.id_empresa) {
        setAreas([]);
        return;
      }
      try {
        const res = await fetch(apiAreas);
        const data = await res.json();
        const filteredAreas = Array.isArray(data)
          ? data.filter(
              (area: any) => area.idEmpresa === Number(formData.id_empresa)
            )
          : [];
        setAreas(filteredAreas);
      } catch (error) {
        console.error("Error cargando áreas:", error);
      }
    };
    fetchAreas();
  }, [formData.id_empresa]);

  // Cambios en inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Captura huella desde cámara
  const capturarHuella = () => {
    if (webcamRef.current) {
      const imagen = webcamRef.current.getScreenshot();
      setHuella(imagen);
    }
  };

  // Enviar registro
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSGVA && !huella) {
      Swal.fire("Error", "Debe capturar la huella para SGVA", "error");
      return;
    }

    if (!isSGVA && formData.contrasena !== formData.confirmacion) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    try {
      const url = isSGVA ? apiRegisterSGVA : apiRegister;

      const body = isSGVA
        ? {
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo_electronico: formData.correo_electronico,
            cargo: formData.cargo,
            contrasena: formData.contrasena,
            id_empresa: Number(formData.id_empresa),
            id_area: Number(formData.id_area),
            huella,
          }
        : {
            ...formData,
            id_empresa: Number(formData.id_empresa),
            id_area: Number(formData.id_area),
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { 'ngrok-skip-browser-warning': 'true',"Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Respuesta backend:", data);

      if (res.ok) {
        Swal.fire("Éxito", "Usuario registrado correctamente", "success");
        onUsuarioCreado();
        onClose();
      } else {
        Swal.fire("Error", data.error || "No se pudo registrar el usuario", "error");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">
          Registro de Usuario
        </h2>

        <form onSubmit={registrar} className="space-y-4">
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={isSGVA}
              onChange={(e) => setIsSGVA(e.target.checked)}
              className="w-5 h-5"
            />
            Es SGVA (Registro con huella)
          </label>

          <select
            name="id_empresa"
            value={formData.id_empresa}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Seleccione una Empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                {empresa.nombre}
              </option>
            ))}
          </select>

          <select
            name="id_area"
            value={formData.id_area}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Seleccione un Área</option>
            {areas.map((area) => (
              <option key={area.idArea} value={area.idArea}>
                {area.descripcion}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {!isSGVA && (
            <>
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre de usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </>
          )}

          <input
            type="email"
            name="correo_electronico"
            placeholder="Correo electrónico"
            value={formData.correo_electronico}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="text"
            name="cargo"
            placeholder="Cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
           <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="password"
                name="confirmacion"
                placeholder="Confirmar contraseña"
                value={formData.confirmacion}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

          {/* MÉTODO DE HUELLA */}
          {isSGVA && (
            <>
              <label className="font-medium text-gray-700 mt-2 block">
                Método de registro de huella:
              </label>
              <select
                value={metodoHuella}
                onChange={(e) => setMetodoHuella(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border mt-2"
                required
              >
                <option value="">Seleccione un método</option>
                <option value="camara">Cámara</option>
                <option value="huellero">Huellero</option>
                <option value="archivo">Archivo</option>
              </select>

              {metodoHuella === "camara" && (
                <div className="flex flex-col items-center gap-2 mt-2">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={capturarHuella}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Capturar Huella
                  </button>
                  {huella && (
                    <img
                      src={huella}
                      alt="Huella capturada"
                      className="mt-2 w-32 h-32 border rounded-lg"
                    />
                  )}
                </div>
              )}

              {metodoHuella === "archivo" && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setHuella(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {huella && (
                    <img
                      src={huella}
                      alt="Huella seleccionada"
                      className="mt-2 w-32 h-32 border rounded-lg"
                    />
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800"
            >
              Registrar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarUsuario;
