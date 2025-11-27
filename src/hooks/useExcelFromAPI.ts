import { useState } from 'react';

export const useExcelFromAPI = () => {
  const [loading, setLoading] = useState(false);

  const descargarExcelDesdeAPI = async (apiUrl: string, fileName: string = 'reporte') => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Usuario no autenticado');
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const blob = await res.blob();
      
      if (blob.size === 0) {
        throw new Error('Archivo vacío recibido');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error('Error descargando Excel desde API:', err);
      
      if (err.name === 'AbortError') {
        alert('La descarga tardó demasiado tiempo. Intenta nuevamente.');
      } else {
        alert(`Error al descargar Excel: ${err.message}`);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { descargarExcelDesdeAPI, loading };
};