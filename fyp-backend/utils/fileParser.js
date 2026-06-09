const pdf = require('pdf-parse');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');
const { promisify } = require('util');
const parseXml = promisify(xml2js.parseString);

async function extractTextFromPPTX(buffer) {
  try {
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    let fullText = '';

    for (const entry of zipEntries) {
      if (entry.entryName.startsWith('ppt/slides/slide')) {
        const content = zip.readAsText(entry, 'utf8');
        const parsed = await parseXml(content);
        const textElements = parsed['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp']
          .map(sp => sp['p:txBody']?.[0]['a:p']?.map(p => p['a:r']?.map(r => r['a:t']?.join('')).join('')).join('\n'))
          .filter(Boolean)
          .join('\n');

        fullText += textElements + '\n';
      }
    }

    return fullText;
  } catch (err) {
    console.error('PPTX parsing error:', err);
    throw new Error('Failed to extract text from PowerPoint file');
  }
}

const parseFile = async (file) => {
  try {
    if (file.mimetype === 'application/pdf') {
      const data = await pdf(file.buffer);
      return data.text;
    }
    
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return await extractTextFromPPTX(file.buffer);
    }
    
    throw new Error('Unsupported file type');
  } catch (err) {
    console.error('File parsing error:', err);
    throw new Error(`File processing failed: ${err.message}`);
  }
};

module.exports = { parseFile };