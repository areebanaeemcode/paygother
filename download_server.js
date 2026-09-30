const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3333;

const FCIT_PDF_PATH = path.resolve(__dirname, 'Pay_Together_FCIT_FYDP_Final_Report.pdf');
const FCIT_DOCX_PATH = path.resolve(__dirname, 'Pay_Together_FCIT_FYDP_Final_Report.docx');
const FCIT_MD_PATH = path.resolve(__dirname, 'Pay_Together_FCIT_FYDP_Complete_Documentation.md');
const ARCH_PDF_PATH = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.pdf');
const VIVA_PDF_PATH = path.resolve(__dirname, 'Pay_Together_FYP_Viva_Questions_and_Answers.pdf');

function serveFile(res, filePath, contentType, isAttachment, filename) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end(`File not found: ${filename}`);
  }
  const stat = fs.statSync(filePath);
  const disposition = isAttachment ? `attachment; filename="${filename}"` : `inline; filename="${filename}"`;
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Content-Disposition': disposition,
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/fcit-pdf' || url === '/download-fcit-pdf' || url === '/Pay_Together_FCIT_FYDP_Final_Report.pdf') {
    serveFile(res, FCIT_PDF_PATH, 'application/pdf', true, 'Pay_Together_FCIT_FYDP_Final_Report.pdf');
  } else if (url === '/view-fcit-pdf') {
    serveFile(res, FCIT_PDF_PATH, 'application/pdf', false, 'Pay_Together_FCIT_FYDP_Final_Report.pdf');
  } else if (url === '/fcit-docx' || url === '/Pay_Together_FCIT_FYDP_Final_Report.docx') {
    serveFile(res, FCIT_DOCX_PATH, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', true, 'Pay_Together_FCIT_FYDP_Final_Report.docx');
  } else if (url === '/fcit-md') {
    serveFile(res, FCIT_MD_PATH, 'text/markdown; charset=utf-8', true, 'Pay_Together_FCIT_FYDP_Complete_Documentation.md');
  } else if (url === '/download-arch-pdf' || url === '/Pay_Together_FYP_Documentation.pdf') {
    serveFile(res, ARCH_PDF_PATH, 'application/pdf', true, 'Pay_Together_FYP_Documentation.pdf');
  } else if (url === '/view-arch-pdf') {
    serveFile(res, ARCH_PDF_PATH, 'application/pdf', false, 'Pay_Together_FYP_Documentation.pdf');
  } else if (url === '/viva-pdf' || url === '/Pay_Together_FYP_Viva_Questions_and_Answers.pdf') {
    serveFile(res, VIVA_PDF_PATH, 'application/pdf', true, 'Pay_Together_FYP_Viva_Questions_and_Answers.pdf');
  } else if (url === '/view-viva-pdf') {
    serveFile(res, VIVA_PDF_PATH, 'application/pdf', false, 'Pay_Together_FYP_Viva_Questions_and_Answers.pdf');
  } else {
    // Elegant portal UI
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pay-Together — FCIT PU FYDP Deliverables & Downloads</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px 16px;
          }
          .container {
            max-width: 980px;
            width: 100%;
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
          }
          .badge {
            display: inline-block;
            background: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
            border: 1px solid rgba(96, 165, 250, 0.3);
            padding: 6px 16px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 14px;
            letter-spacing: 0.5px;
          }
          .header h1 {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(to right, #ffffff, #93c5fd);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
          }
          .header p {
            color: #94a3b8;
            font-size: 15px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }
          .card {
            background: rgba(30, 41, 59, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 26px 22px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(12px);
            transition: transform 0.2s ease, border-color 0.2s ease;
          }
          .card:hover {
            transform: translateY(-4px);
            border-color: rgba(96, 165, 250, 0.4);
          }
          .card.featured {
            border: 2px solid #3b82f6;
            background: rgba(30, 58, 138, 0.25);
            box-shadow: 0 10px 35px rgba(59, 130, 246, 0.2);
          }
          .card-top {
            margin-bottom: 20px;
          }
          .icon {
            font-size: 36px;
            margin-bottom: 14px;
          }
          .card h2 {
            font-size: 19px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
          }
          .card p {
            font-size: 13.5px;
            color: #94a3b8;
            line-height: 1.55;
          }
          .btn-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 11px 16px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-primary {
            background: #2563eb;
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
          }
          .btn-primary:hover {
            background: #1d4ed8;
          }
          .btn-success {
            background: #10b981;
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          }
          .btn-success:hover {
            background: #059669;
          }
          .btn-outline {
            background: transparent;
            color: #cbd5e1;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
          .btn-outline:hover {
            background: rgba(255, 255, 255, 0.06);
            color: #ffffff;
          }
          .footer {
            margin-top: 36px;
            text-align: center;
            font-size: 13px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">FCIT PU &bull; Bachelor of Science (2021-2025)</span>
            <h1>Pay-Together FYP Deliverables Hub</h1>
            <p>Supervisor: Prof. Dr. Engr. Shahzad Sarwar &bull; Faculty of Computing & Information Technology</p>
          </div>

          <div class="grid">
            <!-- Card 1: Official FCIT Report PDF -->
            <div class="card featured">
              <div class="card-top">
                <div class="icon">📕</div>
                <h2>FCIT Final Report (PDF)</h2>
                <p>Complete official template document: Chapters 1–7, SRS, UML Diagrams, Algorithms, Data Dictionary, Testcases, and RTM.</p>
              </div>
              <div class="btn-group">
                <a class="btn btn-primary" href="/download-fcit-pdf">⬇️ Download PDF (1.6 MB)</a>
                <a class="btn btn-outline" href="/view-fcit-pdf" target="_blank">👁️ View in Browser</a>
              </div>
            </div>

            <!-- Card 2: Official FCIT Report Word -->
            <div class="card">
              <div class="card-top">
                <div class="icon">📘</div>
                <h2>FCIT Final Report (.DOCX)</h2>
                <p>Editable Microsoft Word format formatted strictly according to the FCIT PU template fonts, tables, and section headings.</p>
              </div>
              <div class="btn-group">
                <a class="btn btn-success" href="/fcit-docx">⬇️ Download DOCX (78 KB)</a>
                <a class="btn btn-outline" href="/fcit-md">📄 Download Markdown</a>
              </div>
            </div>

            <!-- Card 3: 50-Page Technical Architecture PDF -->
            <div class="card">
              <div class="card-top">
                <div class="icon">🏛️</div>
                <h2>Architecture &amp; System PDF</h2>
                <p>Extended 50-page technical specification containing high-resolution color vector SVG diagrams and system models.</p>
              </div>
              <div class="btn-group">
                <a class="btn btn-primary" href="/download-arch-pdf">⬇️ Download Tech PDF (1.9 MB)</a>
                <a class="btn btn-outline" href="/view-arch-pdf" target="_blank">👁️ View in Browser</a>
              </div>
            </div>

            <!-- Card 4: Viva Voce Prep Guide -->
            <div class="card">
              <div class="card-top">
                <div class="icon">🎓</div>
                <h2>100 Viva Voce Q&amp;A</h2>
                <p>Top 100 examiner defense questions across 10 technical domains with answers for supervisor &amp; external panel evaluation.</p>
              </div>
              <div class="btn-group">
                <a class="btn btn-primary" href="/viva-pdf">⬇️ Download Viva PDF (530 KB)</a>
                <a class="btn btn-outline" href="/view-viva-pdf" target="_blank">👁️ View in Browser</a>
              </div>
            </div>
          </div>

          <div class="footer">
            Final Year Design Project (FYDP) &bull; University of the Punjab, Lahore &bull; Pay-Together
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Pay-Together Download Server listening on port ${PORT}`);
});
