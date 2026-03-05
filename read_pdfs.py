import sys
try:
    import PyPDF2
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    import PyPDF2

files = [
    r"e:\Website\Product Requirements Document.pdf",
    r"e:\Website\UI.pdf",
    r"e:\Website\tech stack.pdf"
]

with open(r"e:\Website\pdf_contents_utf8.txt", "w", encoding="utf-8") as out_f:
    for file in files:
        try:
            out_f.write(f"--- CONTENT OF {file} ---\n")
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                out_f.write(page.extract_text() + "\n")
        except Exception as e:
            out_f.write(f"Error reading {file}: {e}\n")
