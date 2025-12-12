#!/bin/bash

# WordPress to React Migration Script
# Source: damieus-com-restore.local
# Target: damieus_awwwards_poc_1

set -e  # Exit on error

echo "🔄 Starting WordPress → React Migration..."
echo ""

# Configuration
WP_UPLOADS="/Users/dame/management-git/wordpress-local/damieus-com-restore/app/public/wp-content/uploads"
REACT_PUBLIC="/Users/dame/management-git/damieus_awwwards_poc_1/public"
WP_SITE="http://damieus-com-restore.local"

# Step 1: Create image directories
echo "📁 Creating image directories..."
mkdir -p "$REACT_PUBLIC/images/services"
mkdir -p "$REACT_PUBLIC/images/projects"
mkdir -p "$REACT_PUBLIC/images/gallery"
mkdir -p "$REACT_PUBLIC/images/logos"
echo "✅ Directories created"
echo ""

# Step 2: Copy logos
echo "🎨 Copying logos..."
if [ -d "$WP_UPLOADS/2024/12" ]; then
  cp "$WP_UPLOADS/2024/12/Damieus-Logo-Official"*.webp "$REACT_PUBLIC/images/logos/" 2>/dev/null || echo "⚠️  No logos found"
fi
echo "✅ Logos copied"
echo ""

# Step 3: Copy recent images (2023-2025)
echo "🖼️  Copying recent images..."
for year in 2023 2024 2025; do
  if [ -d "$WP_UPLOADS/$year" ]; then
    echo "  Copying from $year..."
    find "$WP_UPLOADS/$year" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) \
      -exec cp {} "$REACT_PUBLIC/images/gallery/" \; 2>/dev/null || true
  fi
done
echo "✅ Recent images copied"
echo ""

# Step 4: Extract WordPress services
echo "📋 Extracting WordPress services..."
curl -s "$WP_SITE/services/" > /tmp/wp-services.html
if [ -s /tmp/wp-services.html ]; then
  echo "✅ Services page extracted"
  
  # Extract service names
  grep -oE '<h[2-3][^>]*>.*?</h[2-3]>' /tmp/wp-services.html | \
    sed 's/<[^>]*>//g' | \
    sort -u > /tmp/wp-services-list.txt
  
  echo ""
  echo "📝 Found services:"
  cat /tmp/wp-services-list.txt
else
  echo "❌ Failed to extract services"
fi
echo ""

# Step 5: Extract WordPress projects/portfolio
echo "💼 Extracting WordPress portfolio..."
curl -s "$WP_SITE/work/" > /tmp/wp-portfolio.html
if [ -s /tmp/wp-portfolio.html ]; then
  echo "✅ Portfolio page extracted"
else
  curl -s "$WP_SITE/portfolio/" > /tmp/wp-portfolio.html
  if [ -s /tmp/wp-portfolio.html ]; then
    echo "✅ Portfolio page extracted"
  else
    echo "⚠️  No portfolio page found"
  fi
fi
echo ""

# Step 6: Extract WordPress menu structure
echo "🧭 Extracting WordPress navigation..."
curl -s "$WP_SITE/" > /tmp/wp-homepage.html
if [ -s /tmp/wp-homepage.html ]; then
  grep -oE '<nav[^>]*>.*?</nav>' /tmp/wp-homepage.html | \
    grep -oE 'href="[^"]*"' | \
    sed 's/href="\([^"]*\)"/\1/' > /tmp/wp-menu-links.txt
  
  echo "✅ Navigation extracted"
  echo ""
  echo "📝 Found menu links:"
  cat /tmp/wp-menu-links.txt
else
  echo "❌ Failed to extract navigation"
fi
echo ""

# Step 7: Count migrated files
echo "📊 Migration Summary:"
echo "  Logos: $(ls -1 "$REACT_PUBLIC/images/logos" 2>/dev/null | wc -l | tr -d ' ')"
echo "  Gallery Images: $(ls -1 "$REACT_PUBLIC/images/gallery" 2>/dev/null | wc -l | tr -d ' ')"
echo ""

# Step 8: Next steps
echo "🎯 Next Steps:"
echo "1. Review extracted services: cat /tmp/wp-services-list.txt"
echo "2. Review extracted menu: cat /tmp/wp-menu-links.txt"
echo "3. Update ServiceDetail.jsx with WordPress services"
echo "4. Update Navigation.jsx with WordPress menu"
echo "5. Update image paths in all components"
echo "6. Run: npm run build && npx vite preview --port 4173"
echo "7. Test site: open http://localhost:4173"
echo ""

echo "✅ Migration script complete!"
echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo "  - Update ServiceDetail.jsx with 20 services from /tmp/wp-services-list.txt"
echo "  - Update image paths in components to use /images/gallery/*.{jpg,png,webp}"
echo "  - Add Gallery link to Navigation.jsx"
echo "  - Verify projects match WordPress portfolio"
