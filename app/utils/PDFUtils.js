import PDFDocument from 'pdfkit'
import fs from 'fs'
import PaperConstants from '../constants/PaperConstants'
import os from 'os'

module.exports = class PDFUtils {

  createDoc(imagePaths, savePath = null) {
    const fileName = `${new Date().getTime()}.pdf`
    const doc = new PDFDocument({
      // size assumes portrait orientation
      size: [PaperConstants.LETTER_WIDTH.PORTRAIT, PaperConstants.LETTER_HEIGHT.PORTRAIT],
      layout: 'landscape',
    })
    const docName = `${savePath}/${fileName}`
    this.openDoc(doc, docName)
    switch(os.platform()) {
      case 'darwin':
        this.setFont(doc, '/Library/Fonts/Arial Black.ttf')
        break
      case 'win32':
        this.setFont(doc, 'C:/Windows/Fonts/ariblk.ttf')
        break
      default:
        throw new Error('Unsupported OS: ' + os.platform())
    }
    imagePaths.forEach(i => {
      const newPage = (i !== imagePaths[0])
      this.addImage(doc, i, newPage)
    })
    this.closeDoc(doc)
    return docName
  }

  openDoc(doc, docPath) {
    doc.pipe(fs.createWriteStream(docPath))
  }

  setFont(doc, fontPath) {
    doc.font(fontPath)
  }

  addImage(doc, imagePath, newPage, instructions=null) {
    if (newPage) { doc.addPage() }

    doc.image(
      imagePath, 0, 0, {
        fit    : [PaperConstants.LETTER_WIDTH.LANDSCAPE, PaperConstants.LETTER_HEIGHT.LANDSCAPE],
        valign: 'center'
      }
    )

    if (instructions !== null) {
      doc.moveTo(0, 450).text(instructions, 0, 450)
    }
  }

  closeDoc(doc) {
    doc.end()
  }
}
