import os
import subprocess
import re

MD_PATH = r"c:\Users\muham\Downloads\FYP (1)\Pay_Together_FCIT_FYDP_Complete_Documentation.md"
HTML_PATH = r"c:\Users\muham\Downloads\FYP (1)\Pay_Together_FCIT_FYDP_Final_Report.html"
PDF_PATH = r"c:\Users\muham\Downloads\FYP (1)\Pay_Together_FCIT_FYDP_Final_Report.pdf"

with open(MD_PATH, 'r', encoding='utf-8') as f:
    lines = f.readlines()

html_body = []
in_table = False
table_rows = []
in_code = False
code_lines = []
code_lang = ""

def format_inline(text):
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
    text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
    return text

for line in lines:
    stripped = line.strip()
    
    # Code block
    if stripped.startswith("```"):
        if in_code:
            html_body.append(f"<pre class='code-box'><code>{''.join(code_lines)}</code></pre>")
            in_code = False
            code_lines = []
        else:
            in_code = True
            code_lang = stripped[3:].strip()
        continue
    
    if in_code:
        code_lines.append(line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
        continue

    # Tables
    if stripped.startswith("|") and stripped.endswith("|"):
        if not in_table:
            in_table = True
            table_rows = []
        # check if delimiter row
        if re.match(r'^\|[\s\-:|]+\|$', stripped):
            continue
        cells = [c.strip() for c in stripped[1:-1].split('|')]
        table_rows.append(cells)
        continue
    else:
        if in_table:
            # flush table
            html_body.append("<div class='table-container'><table class='report-table'>")
            for idx, r in enumerate(table_rows):
                tag = "th" if idx == 0 else "td"
                html_body.append("<tr>" + "".join([f"<{tag}>{format_inline(c)}</{tag}>" for c in r]) + "</tr>")
            html_body.append("</table></div>")
            in_table = False
            table_rows = []

    if not stripped:
        continue

    # Headings
    if stripped.startswith("# "):
        html_body.append(f"<h1 class='title-main'>{format_inline(stripped[2:])}</h1>")
    elif stripped.startswith("## "):
        txt = stripped[3:]
        if any(sec in txt for sec in ["DECLARATION", "CERTIFICATE OF APPROVAL", "Executive Summary", "Chapter", "Appendix", "References"]):
            html_body.append(f"<div class='page-break'></div><h2 class='section-h1'>{format_inline(txt)}</h2>")
        else:
            html_body.append(f"<h2 class='section-h1'>{format_inline(txt)}</h2>")
    elif stripped.startswith("### "):
        html_body.append(f"<h3 class='section-h2'>{format_inline(stripped[4:])}</h3>")
    elif stripped.startswith("#### "):
        html_body.append(f"<h4 class='section-h3'>{format_inline(stripped[5:])}</h4>")
    elif stripped.startswith("- ") or stripped.startswith("* "):
        html_body.append(f"<li class='bullet-item'>{format_inline(stripped[2:])}</li>")
    elif re.match(r'^\d+\.\s', stripped):
        m = re.match(r'^\d+\.\s*(.*)', stripped)
        html_body.append(f"<li class='number-item'>{format_inline(m.group(1))}</li>")
    elif stripped.startswith("---"):
        html_body.append("<hr class='divider'/>")
    else:
        html_body.append(f"<p class='body-para'>{format_inline(stripped)}</p>")

if in_table:
    html_body.append("<div class='table-container'><table class='report-table'>")
    for idx, r in enumerate(table_rows):
        tag = "th" if idx == 0 else "td"
        html_body.append("<tr>" + "".join([f"<{tag}>{format_inline(c)}</{tag}>" for c in r]) + "</tr>")
    html_body.append("</table></div>")

full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pay-Together — FCIT PU FYDP Final Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  @page {{
    size: A4;
    margin: 20mm 15mm 20mm 18mm;
    @bottom-right {{
      content: counter(page);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 9pt;
      color: #64748b;
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  body {{
    font-family: 'Times New Roman', 'Merriweather', Georgia, serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #0f172a;
    background-color: #ffffff;
    margin: 0;
    padding: 10px;
  }}

  .page-break {{
    page-break-before: always;
  }}

  h1.title-main {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 24pt;
    font-weight: 800;
    color: #1e3a8a;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 20px;
  }}

  h2.section-h1 {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 17pt;
    font-weight: 700;
    color: #0e4660;
    border-bottom: 2px solid #0e4660;
    padding-bottom: 6px;
    margin-top: 28px;
    margin-bottom: 14px;
    page-break-after: avoid;
  }}

  h3.section-h2 {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5pt;
    font-weight: 600;
    color: #1e293b;
    margin-top: 20px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }}

  h4.section-h3 {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5pt;
    font-weight: 600;
    color: #334155;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }}

  p.body-para {{
    margin-top: 0;
    margin-bottom: 9px;
    text-align: justify;
    text-justify: inter-word;
  }}

  li.bullet-item, li.number-item {{
    margin-bottom: 4px;
    line-height: 1.5;
  }}

  .table-container {{
    margin: 14px 0;
    page-break-inside: avoid;
  }}

  table.report-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
    font-family: 'Plus Jakarta Sans', Arial, sans-serif;
  }}

  table.report-table th {{
    background-color: #0e4660;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 7px 9px;
    border: 1px solid #0e4660;
  }}

  table.report-table td {{
    padding: 6px 9px;
    border: 1px solid #cbd5e1;
    color: #1e293b;
    vertical-align: top;
  }}

  table.report-table tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}

  pre.code-box {{
    background: #0f172a;
    color: #f8fafc;
    padding: 12px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: auto;
    page-break-inside: avoid;
    margin: 12px 0;
  }}

  code {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 4px;
    border-radius: 3px;
  }}

  hr.divider {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
  }}
</style>
</head>
<body>
{''.join(html_body)}
</body>
</html>
"""

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(full_html)

print("HTML generated successfully at:", HTML_PATH)

# Run chrome headless to print to PDF
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

browser = chrome_path if os.path.exists(chrome_path) else edge_path
print("Using browser:", browser)

cmd = [
    browser,
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={PDF_PATH}',
    HTML_PATH
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
if os.path.exists(PDF_PATH):
    size_kb = os.path.getsize(PDF_PATH) / 1024
    print(f"SUCCESS: Generated PDF at {PDF_PATH} ({size_kb:.1f} KB)")
else:
    print("FAILED to generate PDF:", res.stderr)
