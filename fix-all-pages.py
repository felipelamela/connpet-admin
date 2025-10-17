#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Diretório base
base_dir = Path("/home/anarke/Área de trabalho/coonpet/connpet-admin/src/app")

# Encontrar todos os arquivos page.tsx
page_files = list(base_dir.rglob("page.tsx"))

print(f"Encontrados {len(page_files)} arquivos page.tsx")

for file_path in page_files:
    print(f"Processando: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove LayoutWrapper duplicado
        content = re.sub(r'(<LayoutWrapper>)\s*\n\s*<LayoutWrapper>', r'\1', content)
        
        # Substitui </main>\n    </div> por </main>\n    </LayoutWrapper>
        content = re.sub(r'(</main>)\s*\n\s*</div>(\s*\n\s*\);)', r'\1\n    </LayoutWrapper>\2', content)
        
        # Só salva se houver alterações
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Corrigido")
        else:
            print(f"  - Sem alterações necessárias")
            
    except Exception as e:
        print(f"  ✗ Erro: {e}")

print("\nCorreção concluída!")

