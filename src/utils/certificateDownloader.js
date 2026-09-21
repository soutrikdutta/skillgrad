import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads the certificate DOM element as a crisp, single-page A4 landscape PDF
 * @param {HTMLElement} element - The DOM element containing the certificate
 * @param {string} serialNumber - Certificate serial number for filename
 */
export async function downloadCertificatePDF(element, serialNumber = 'CREDENTIAL') {
  if (!element) return false;

  try {
    // Render element to high-res canvas (scale: 2 for sharp 300 DPI text)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create A4 Landscape PDF (297mm x 210mm)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add image scaled to fit A4 page with 10mm margins
    const margin = 10;
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = pdfHeight - (margin * 2);

    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight, '', 'FAST');
    
    const cleanSerial = (serialNumber || 'SkillGrad-Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`${cleanSerial}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF download error, falling back to print:', err);
    window.print();
    return false;
  }
}

/**
 * Downloads the certificate DOM element as a crisp PNG image (great for LinkedIn/sharing)
 * @param {HTMLElement} element - The DOM element containing the certificate
 * @param {string} serialNumber - Certificate serial number for filename
 */
export async function downloadCertificatePNG(element, serialNumber = 'CREDENTIAL') {
  if (!element) return false;

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200
    });

    const link = document.createElement('a');
    const cleanSerial = (serialNumber || 'SkillGrad-Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${cleanSerial}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (err) {
    console.error('PNG download error:', err);
    return false;
  }
}
