"""Validate a supplier CSV before importing; expected columns: name,design_code,metal_type,category_id,description,style,image_path."""
import csv, sys
from pathlib import Path
REQUIRED={'name','design_code','metal_type','category_id','image_path'}
def main(path):
    with open(path,newline='',encoding='utf-8-sig') as f:
        reader=csv.DictReader(f)
        missing=REQUIRED-set(reader.fieldnames or [])
        if missing: raise SystemExit('Missing columns: '+', '.join(sorted(missing)))
        count=0
        for line,row in enumerate(reader,2):
            if row['metal_type'] not in ('Gold','Silver'): raise SystemExit(f'Line {line}: metal_type must be Gold or Silver')
            if not Path(row['image_path']).is_file(): raise SystemExit(f"Line {line}: image file not found: {row['image_path']}")
            count+=1
    print(f'Validated {count} rows. Add through the authenticated admin API to apply server-side validation and image processing.')
if __name__=='__main__': main(sys.argv[1])
