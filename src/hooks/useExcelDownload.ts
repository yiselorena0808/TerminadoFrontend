import { useState } from 'react';
import { FirebaseExcelService } from '../services/firebaseExcelService';

export const useExcelDownload = () => {
  const [loading, setLoading] = useState(false);

  const descargarExcel = async (
    data: any[], 
    fileName: string,
    sheetName: string = 'Datos'
  ) => {
    try {
      setLoading(true);
      
      const excelUrl = await FirebaseExcelService.generateAndUploadExcel(
        data, 
        fileName, 
        sheetName
      );
      
      FirebaseExcelService.downloadFile(excelUrl, `${fileName}.xlsx`);
      
    } catch (error: any) {
      console.error('Error descargando Excel:', error);
      alert(error.message || 'Error al generar el Excel');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { descargarExcel, loading };
};