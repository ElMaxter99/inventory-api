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
echo "🧹 Limpiando imágenes dangling..."
docker image prune -f

# 3️⃣ Reconstruir imagen (sin usar caché)
echo "🔧 Reconstruyendo imagen Docker..."
docker compose build --no-cache

# 4️⃣ Levantar todo de nuevo
echo "🚀 Levantando nueva versión..."
docker compose up -d

# 5️⃣ Mostrar estado final
echo "✅ Redeploy completado con éxito."
docker compose ps
