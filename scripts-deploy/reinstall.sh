#!/bin/bash
# ==================================================
# ♻️  RestartInventory API (Docker)
# ==================================================

set -e

echo "� Reiniciando contenedores de Inventory API..."

# Ir al directorio del proyecto
cd "$(dirname "$0")/.." || exit 1

# Detener los contenedores (sin eliminar datos)
docker compose down

# Iniciar nuevamente en modo background
docker compose up -d

echo "✅ Aplicación reiniciada correctamente."
docker compose ps
read -rp "¿Estás seguro de que quieres continuar? [y/N]: " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Operación cancelada.${NC}"
    exit 0
fi

echo
echo -e "${CYAN}🛑 Deteniendo y eliminando contenedores, redes, imágenes y volúmenes...${NC}"
cd "$(dirname "$0")/.." || exit 1
docker compose down --rmi all --volumes --remove-orphans

echo
echo -e "${CYAN}🔧 Reconstruyendo e iniciando contenedores desde cero...${NC}"
docker compose up -d --build

echo
echo -e "${GREEN}✅ Reinstalación completa.${NC}"
docker compose ps
