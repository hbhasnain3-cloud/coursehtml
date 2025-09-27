// backend/src/services/certificateService.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class CertificateService {
  generateCertificate(user, course) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          layout: 'landscape',
          size: 'A4'
        });

        const filename = `certificate_${user.id}_${course.id}.pdf`;
        const filePath = path.join(__dirname, '../certificates', filename);
        
        // Pipe PDF to file
        doc.pipe(fs.createWriteStream(filePath));

        // Add certificate content
        this.addCertificateContent(doc, user, course);

        doc.end();

        resolve(filename);
      } catch (error) {
        reject(error);
      }
    });
  }

  addCertificateContent(doc, user, course) {
    // Certificate design
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');
    
    // Border
    doc.strokeColor('#3b82f6')
       .lineWidth(20)
       .rect(10, 10, doc.page.width - 20, doc.page.height - 20)
       .stroke();

    // Title
    doc.fontSize(32)
       .fillColor('#1f2937')
       .text('Certificate of Completion', doc.page.width / 2, 100, { align: 'center' });

    // User name
    doc.fontSize(24)
       .fillColor('#3b82f6')
       .text(user.name, doc.page.width / 2, 180, { align: 'center' });

    // Course details
    doc.fontSize(18)
       .fillColor('#4b5563')
       .text(`has successfully completed the course "${course.title}"`, 
             doc.page.width / 2, 230, { align: 'center' });

    // Date
    doc.text(`Completed on: ${new Date().toLocaleDateString()}`, 
             doc.page.width / 2, 280, { align: 'center' });
  }
}

module.exports = new CertificateService();