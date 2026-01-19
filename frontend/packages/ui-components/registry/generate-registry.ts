#!/usr/bin/env tsx

/*
 * Component Registry Generator
 *
 * Build-time script that:
 * 1. Scans organisms/[name]/[name].meta.ts files
 * 2. Loads metadata from each component
 * 3. Generates registry.json with indexed components
 * 4. Validates metadata schema
 *
 * Usage: pnpm generate-registry
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'
import { ComponentRegistry, ComponentMetadata } from './registry-types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Main registry generation function
 */
async function generateRegistry() {
  console.log('🔍 Starting component registry generation...')
  console.log(`📂 Scanning directory: ${path.join(__dirname, '../organisms')}`)

  const registry: ComponentRegistry = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    components: {},
    categories: {} as any,
    industries: {} as any,
  }

  try {
    // Find all .meta.ts files in organisms/
    const metaFiles = globSync('**/*/[A-Z]*.meta.ts', {
      cwd: path.join(__dirname, '..', 'organisms'),
      absolute: true,
    })

    console.log(`📦 Found ${metaFiles.length} component metadata files\n`)

    if (metaFiles.length === 0) {
      console.log('⚠️  No components found. Registry will be empty.')
    }

    // Process each metadata file
    for (const metaFile of metaFiles) {
      const componentDir = path.dirname(metaFile)
      const componentName = path.basename(componentDir)
      const relativePath = path.relative(path.join(__dirname, '..'), metaFile)

      try {
        // Dynamic import of metadata
        // Convert .meta.ts path to import path
        const importPath = `./${path.relative(path.join(__dirname, '..'), componentDir).replace(/\\/g, '/')}`

        // For Node.js ES modules, we need to use dynamic import
        // Convert Windows path to file URL properly
        let fileUrl = metaFile.replace(/\\/g, '/')
        if (fileUrl.match(/^[a-zA-Z]:/)) {
          fileUrl = `file:///${fileUrl}`
        } else if (!fileUrl.startsWith('file://')) {
          fileUrl = `file://${fileUrl}`
        }

        const metadataModule = await import(fileUrl)

        const metadata: ComponentMetadata = metadataModule.default

        if (!metadata) {
          console.warn(`  ⚠️  No default export in ${relativePath}`)
          continue
        }

        // Validate metadata
        if (!metadata.id || !metadata.name || !metadata.type) {
          console.warn(`  ⚠️  Invalid metadata in ${relativePath}: missing id, name, or type`)
          continue
        }

        // Add to registry
        registry.components[metadata.id] = metadata

        // Index by category
        if (!registry.categories[metadata.category]) {
          registry.categories[metadata.category] = []
        }
        registry.categories[metadata.category].push(metadata.id)

        // Index by industries
        if (!Array.isArray(metadata.industries)) {
          metadata.industries = []
        }
        metadata.industries.forEach((industry) => {
          if (!registry.industries[industry]) {
            registry.industries[industry] = []
          }
          registry.industries[industry].push(metadata.id)
        })

        console.log(`  ✅ ${metadata.name} (${metadata.id})`)
      } catch (err) {
        console.error(`  ❌ Failed to process ${relativePath}:`, err)
        continue
      }
    }

    // Write registry.json
    const outputPath = path.join(__dirname, 'registry.json')
    fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2))

    // Summary
    console.log('\n✨ Registry generation completed!')
    console.log(`   📄 Output: ${outputPath}`)
    console.log(`   📊 Total components: ${Object.keys(registry.components).length}`)
    console.log(`   🏷️  Categories: ${Object.keys(registry.categories).length}`)
    console.log(`   🌍 Industries: ${Object.keys(registry.industries).length}`)
    console.log(`   ⏰ Generated: ${registry.generatedAt}`)

    // List components by category
    console.log('\n📂 Components by category:')
    Object.entries(registry.categories).forEach(([category, componentIds]) => {
      console.log(`   ${category}: ${componentIds.length} components`)
    })
  } catch (err) {
    console.error('\n❌ Registry generation failed:', err)
    process.exit(1)
  }
}

// Run generator
generateRegistry().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
