#!/bin/bash
set -e

# Configuration
API_DIR="../api"
DOCS_DIR="."
API_DOCS_DIR="$API_DIR/public/docs"

echo "🚀 Syncing API documentation from $API_DIR..."

# Check if API directory exists
if [ ! -d "$API_DIR" ]; then
    echo "❌ API directory not found at $API_DIR"
    echo "Please ensure the API project is located at ../api relative to this script"
    exit 1
fi

# Generate fresh OpenAPI specs in the API project
echo "📝 Generating fresh OpenAPI specifications..."
cd "$API_DIR"
npm run docs:generate
cd - > /dev/null

# Check if docs were generated
if [ ! -f "$API_DOCS_DIR/openapi-public.yaml" ]; then
    echo "❌ OpenAPI specs not found in $API_DOCS_DIR"
    echo "Make sure the API project generates docs in public/docs/"
    exit 1
fi

# Copy main OpenAPI spec
echo "📋 Copying OpenAPI specifications..."
cp "$API_DOCS_DIR/openapi-public.yaml" "$DOCS_DIR/openapi/openapi.yaml"
cp "$API_DOCS_DIR/openapi-public.json" "$DOCS_DIR/openapi/openapi.json"

# Copy metadata if available
if [ -f "$API_DOCS_DIR/metadata.json" ]; then
    cp "$API_DOCS_DIR/metadata.json" "$DOCS_DIR/openapi/metadata.json"
fi

# Extract components if yq is available
if command -v yq &> /dev/null; then
    echo "🔧 Extracting OpenAPI components..."
    
    # Create component files
    mkdir -p "$DOCS_DIR/openapi/components/schemas"
    mkdir -p "$DOCS_DIR/openapi/components/examples"
    mkdir -p "$DOCS_DIR/openapi/components/parameters"
    mkdir -p "$DOCS_DIR/openapi/components/responses"
    
    # Extract components
    yq eval '.components.schemas // {}' "$DOCS_DIR/openapi/openapi.yaml" > "$DOCS_DIR/openapi/components/schemas/all.yaml"
    yq eval '.components.examples // {}' "$DOCS_DIR/openapi/openapi.yaml" > "$DOCS_DIR/openapi/components/examples/all.yaml"
    yq eval '.components.parameters // {}' "$DOCS_DIR/openapi/openapi.yaml" > "$DOCS_DIR/openapi/components/parameters/all.yaml"
    yq eval '.components.responses // {}' "$DOCS_DIR/openapi/openapi.yaml" > "$DOCS_DIR/openapi/components/responses/all.yaml"
    
    # Update examples with actual server URLs
    SANDBOX_URL=$(yq eval '.servers[] | select(.description | test(".*[Ss]andbox.*|.*[Dd]ev.*")) | .url' "$DOCS_DIR/openapi/openapi.yaml" | head -1)
    PROD_URL=$(yq eval '.servers[] | select(.description | test(".*[Pp]rod.*")) | .url' "$DOCS_DIR/openapi/openapi.yaml" | head -1)
    
    if [ ! -z "$SANDBOX_URL" ]; then
        echo "🔄 Updating examples with sandbox URL: $SANDBOX_URL"
        find examples -name "*.sh" -exec sed -i.bak "s|https://sandbox\.api\.jurono\.eu|$SANDBOX_URL|g" {} \;
        find examples -name "*.js" -exec sed -i.bak "s|https://sandbox\.api\.jurono\.eu|$SANDBOX_URL|g" {} \;
        find examples -name "*.py" -exec sed -i.bak "s|https://sandbox\.api\.jurono\.eu|$SANDBOX_URL|g" {} \;
        # Clean up backup files
        find examples -name "*.bak" -delete
    fi
else
    echo "⚠️  yq not found - skipping component extraction"
    echo "   Install yq with: brew install yq (macOS) or snap install yq (Linux)"
fi

# Update changelog
API_VERSION=$(grep -o "version: ['\"].*['\"]" "$DOCS_DIR/openapi/openapi.yaml" | cut -d'"' -f2 | cut -d"'" -f2)
if [ ! -z "$API_VERSION" ]; then
    echo "📝 Updating changelog for version $API_VERSION..."
    cat > "$DOCS_DIR/changelog/v1.md" << EOF
# Changelog (v${API_VERSION})
- Updated API specification from main API repository
- Generated on $(date -u +"%Y-%m-%d %H:%M:%S UTC")
- Sync script: scripts/sync-from-api.sh
EOF
fi

# Update README with sync information
SYNC_INFO="Last synced: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
if grep -q "Last synced:" "$DOCS_DIR/README.md"; then
    sed -i.bak "s/Last synced:.*/Last synced: $(date -u +"%Y-%m-%d %H:%M:%S UTC")/" "$DOCS_DIR/README.md"
    rm -f "$DOCS_DIR/README.md.bak"
else
    echo "" >> "$DOCS_DIR/README.md"
    echo "<!-- Auto-generated sync info -->" >> "$DOCS_DIR/README.md"
    echo "$SYNC_INFO" >> "$DOCS_DIR/README.md"
fi

echo "✅ API documentation sync completed successfully!"
echo "   📁 OpenAPI spec updated: openapi/openapi.yaml"
echo "   📋 Components extracted: openapi/components/"
echo "   📝 Changelog updated: changelog/v1.md"
echo ""
echo "🔍 Next steps:"
echo "   • Review the changes: git diff"
echo "   • Test the docs site: cd website && npm start"
echo "   • Commit changes: git add . && git commit -m 'sync: update from API repo'"
echo "   • Validate OpenAPI: npm run validate (if configured)"