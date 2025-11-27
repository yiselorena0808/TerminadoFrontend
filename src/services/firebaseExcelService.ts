import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';

export interface ExcelData {
  [key: string]: any;
}

export class FirebaseExcelService {
  
  // Método universal para generar y subir Excel
  static async generateAndUploadExcel(
    data: ExcelData[], 
    fileName: string,
    sheetName: string = 'Datos'
  ): Promise<string> {
    try {
      // Convertir datos a formato Excel (CSV como fallback)
      const excelBlob = await this.convertToExcelBlob(data, sheetName);
      
      const timestamp = Date.now();
      const file = new File(
        [excelBlob], 
        `${fileName}_${timestamp}.xlsx`, 
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );
      
      // Subir a Firebase Storage
      return await this.uploadFile(file, 'excels');
      
    } catch (error) {
      console.error('Error generando Excel:', error);
      throw new Error('No se pudo generar el archivo Excel');
    }
  }

  // Subir archivo a Firebase
  private static async uploadFile(file: File, folder: string): Promise<string> {
    const storageRef = ref(storage, `${folder}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  // Convertir datos a blob de Excel
  private static async convertToExcelBlob(data: any[], sheetName: string): Promise<Blob> {
    try {
      // Intentar usar SheetJS si está disponible
      if (typeof window !== 'undefined' && (window as any).XLSX) {
        return await this.useSheetJS(data, sheetName);
      } else {
        // Fallback a CSV
        return this.convertToCSV(data);
      }
    } catch (error) {
      console.warn('Usando fallback CSV:', error);
      return this.convertToCSV(data);
    }
  }

  // Usar SheetJS para Excel real
  private static async useSheetJS(data: any[], sheetName: string): Promise<Blob> {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  // Fallback a CSV
  private static convertToCSV(data: any[]): Blob {
    if (data.length === 0) {
      return new Blob(['No hay datos'], { type: 'text/csv' });
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] ?? '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  // Descargar archivo desde URL
  static downloadFile(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}