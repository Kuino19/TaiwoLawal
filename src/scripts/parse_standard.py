import zipfile
import xml.etree.ElementTree as ET
import json
import re

docx_path = r'c:\Users\IFEDAYO LAWAL\Videos\standard\STANDARD OF ATTAINMENT - quiz.docx'
z = zipfile.ZipFile(docx_path)
doc = ET.fromstring(z.read('word/document.xml'))
paras = [''.join(node.itertext()).strip() for node in doc.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p') if ''.join(node.itertext()).strip()]

print(f"Total raw paragraphs: {len(paras)}")
# Find where questions start
if paras[0] == "STANDARD OF ATTAINMENT":
    paras = paras[1:]

items = []
current_q = None
current_a = []

for p in paras:
    # A question typically contains '?' or starts with a number followed by Q: or question text
    # Answers start with A: or Answer:
    is_answer_start = p.startswith("A:") or p.startswith("Answer:")
    is_quote = p.startswith('"') or p.startswith('“') or p.startswith('”') or p.startswith("'") or p.startswith("...")
    
    # Check if p is a question
    if not is_answer_start and not is_quote and ('?' in p or re.match(r'^\d+[\.\s]', p)):
        if current_q:
            items.append({
                "raw_q": current_q,
                "raw_a": " ".join(current_a)
            })
        current_q = p
        current_a = []
    else:
        current_a.append(p)

if current_q:
    items.append({
        "raw_q": current_q,
        "raw_a": " ".join(current_a)
    })

print(f"Total parsed items: {len(items)}")
for idx, it in enumerate(items, 1):
    print(f"[{idx}] {it['raw_q']}")
    print(f"     -> {it['raw_a'][:80]}...")
