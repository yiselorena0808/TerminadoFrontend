import React, { useState } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export interface UsuarioExcel {
  id_empresa: string;
  id_area: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  correo_electronico: string;
  cargo: string;
  contrasena: string;
  confirmacion?: string;
}

interface UploadExcelProps {
  apiBulk: string;
  onUsuariosCreados: () => void;
}

const UploadExcel: React.FC<UploadExcelProps> = ({ apiBulk, onUsuariosCreados }) => {
  const [usuarios, setUsuarios] = useState<UsuarioExcel[]>([]);
  const [archivo, setArchivo] = useState<File | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivo(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<UsuarioExcel>(worksheet).map((u) => ({
        ...u,
        contrasena: String(u.contrasena ?? ""),
        confirmacion: String(u.confirmacion ?? ""), 
        }));
        setUsuarios(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const enviarUsuarios = async () => {
    if (usuarios.length === 0) {
      Swal.fire("Error", "Primero selecciona un archivo Excel", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "No se encontró el token de autenticación", "error");
      return;
    }

    try {
      const res = await fetch(apiBulk, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ users: usuarios }),
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (!res.ok) {
        throw new Error(data.error || "Error en el registro masivo");
      }

      Swal.fire(
        "Éxito",
        `Usuarios registrados correctamente (${data.resultado?.created || usuarios.length})`,
        "success"
      );
      onUsuariosCreados();
      setUsuarios([]);
      setArchivo(null);
    } catch (error: any) {
      console.error(" Error al enviar usuarios:", error);
      Swal.fire("Error", error.message || "Error interno del servidor", "error");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Cargar usuarios desde Excel</h3>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        className="border p-2 w-full mb-4 rounded-lg"
      />

      {archivo && (
        <p className="text-sm text-gray-600 mb-3">
          Archivo seleccionado: <strong>{archivo.name}</strong> ({usuarios.length} registros)
        </p>
      )}

      <button
        onClick={enviarUsuarios}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        Enviar Usuarios
      </button>
    </div>
  );
};

export default UploadExcel;
