// hooks/useExcelGenerator.ts
import { useState } from 'react';
import * as XLSX from 'xlsx';

export const useExcelGenerator = () => {
  const [loading, setLoading] = useState(false);

  const generarExcel = (data: any[], fileName: string, sheetName: string = 'Datos') => {
    try {
      setLoading(true);

      // Crear workbook y worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generar archivo Excel
      XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
    } catch (error) {
      console.error('Error generando Excel:', error);
      alert('Error al generar el archivo Excel');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { generarExcel, loading };
};