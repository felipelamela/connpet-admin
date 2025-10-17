#!/bin/bash

# Script para corrigir o layout das páginas
# Remove LayoutWrapper duplicado e ajusta as tags de fechamento

cd "/home/anarke/Área de trabalho/coonpet/connpet-admin/src/app"

# Encontrar todos os arquivos page.tsx
find . -name "page.tsx" -type f | while read file; do
    echo "Processando: $file"
    
    # Remove LayoutWrapper duplicado
    sed -i '/<LayoutWrapper>/,/<LayoutWrapper>/{
        /<LayoutWrapper>/{
            x
            s/^$/1/
            t one
            :one
            s/^1$/2/
            t two
            p
            d
            :two
            d
        }
    }' "$file"
    
    # Substitui </div> final por </LayoutWrapper> onde apropriado
    # (apenas onde há </main> seguido de </div>)
    sed -i ':a;N;$!ba;s#\(</main>\)\s*\n\s*\(</div>\)#\1\n    </LayoutWrapper>#g' "$file"
    
done

echo "Correção concluída!"

