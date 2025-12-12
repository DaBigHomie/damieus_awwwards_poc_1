/**
 * Parse WordPress XML Export for Pages and Posts
 * 
 * Extracts pages, posts, categories, and tags from WordPress XML export file
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface WordPressItem {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  status: string;
  type: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
}

interface ParsedContent {
  pages: WordPressItem[];
  posts: WordPressItem[];
  categories: string[];
  tags: string[];
}

/**
 * Strip HTML tags and decode entities
 */
function stripHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract text between XML tags
 */
function extractTagContent(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, 'i');
  const cdataMatch = xml.match(regex);
  if (cdataMatch) {
    return cdataMatch[1].trim();
  }

  const simpleRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const simpleMatch = xml.match(simpleRegex);
  if (simpleMatch) {
    return simpleMatch[1].trim();
  }

  return null;
}

/**
 * Parse a single WordPress item from XML
 */
function parseItem(itemXml: string): WordPressItem | null {
  const title = extractTagContent(itemXml, 'title') || 'Untitled';
  const slug = extractTagContent(itemXml, 'wp:post_name') || '';
  const content = extractTagContent(itemXml, 'content:encoded') || '';
  const excerpt = extractTagContent(itemXml, 'excerpt:encoded') || '';
  const date = extractTagContent(itemXml, 'wp:post_date') || '';
  const status = extractTagContent(itemXml, 'wp:status') || 'draft';
  const type = extractTagContent(itemXml, 'wp:post_type') || 'post';

  // Skip drafts, revisions, and nav menu items
  if (status !== 'publish' || type === 'revision' || type === 'nav_menu_item') {
    return null;
  }

  // Extract categories
  const categoryMatches = itemXml.match(/<category domain="category"[^>]*><!\[CDATA\[([^\]]+)\]\]><\/category>/g);
  const categories = categoryMatches?.map(cat => {
    const match = cat.match(/<!\[CDATA\[([^\]]+)\]\]>/);
    return match ? match[1] : '';
  }).filter(Boolean) || [];

  // Extract tags
  const tagMatches = itemXml.match(/<category domain="post_tag"[^>]*><!\[CDATA\[([^\]]+)\]\]><\/category>/g);
  const tags = tagMatches?.map(tag => {
    const match = tag.match(/<!\[CDATA\[([^\]]+)\]\]>/);
    return match ? match[1] : '';
  }).filter(Boolean) || [];

  return {
    title,
    slug,
    content,
    excerpt,
    date,
    status,
    type,
    categories: categories.length > 0 ? categories : undefined,
    tags: tags.length > 0 ? tags : undefined,
  };
}

/**
 * Parse WordPress XML export
 */
function parseWordPressXML(xmlPath: string): ParsedContent {
  console.log(`📖 Reading WordPress XML export from: ${xmlPath}`);
  
  if (!existsSync(xmlPath)) {
    throw new Error(`XML file not found: ${xmlPath}`);
  }

  const xml = readFileSync(xmlPath, 'utf-8');
  console.log(`✅ Loaded XML file (${(xml.length / 1024 / 1024).toFixed(2)} MB)`);

  // Extract all items
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  console.log(`📝 Found ${itemMatches.length} items in XML`);

  const pages: WordPressItem[] = [];
  const posts: WordPressItem[] = [];
  const allCategories = new Set<string>();
  const allTags = new Set<string>();

  let processed = 0;
  let skipped = 0;

  for (const itemXml of itemMatches) {
    const item = parseItem(itemXml);
    
    if (!item) {
      skipped++;
      continue;
    }

    processed++;

    // Categorize by type
    if (item.type === 'page') {
      pages.push(item);
    } else if (item.type === 'post') {
      posts.push(item);
      
      // Collect categories and tags
      item.categories?.forEach(cat => allCategories.add(cat));
      item.tags?.forEach(tag => allTags.add(tag));
    }
  }

  console.log(`✅ Processed ${processed} items (${skipped} skipped)`);
  console.log(`   📄 Pages: ${pages.length}`);
  console.log(`   📰 Posts: ${posts.length}`);
  console.log(`   📂 Categories: ${allCategories.size}`);
  console.log(`   🏷️  Tags: ${allTags.size}`);

  return {
    pages,
    posts,
    categories: Array.from(allCategories).sort(),
    tags: Array.from(allTags).sort(),
  };
}

/**
 * Main execution
 */
async function main() {
  const xmlPath = process.argv[2] || '/Users/dame/management-git/wordpress-local/damieus-com-restore/wp-export/damieus.WordPress.2025-12-12.xml';
  const outputDir = join(__dirname, '../wordpress-extracted');

  try {
    console.log('🚀 Starting WordPress XML parser...\n');

    const result = parseWordPressXML(xmlPath);

    // Save parsed content
    const pagesPath = join(outputDir, 'pages-from-xml.json');
    const postsPath = join(outputDir, 'posts-from-xml.json');
    const categoriesPath = join(outputDir, 'categories.json');
    const tagsPath = join(outputDir, 'tags.json');
    const summaryPath = join(outputDir, 'xml-parse-summary.json');

    writeFileSync(pagesPath, JSON.stringify(result.pages, null, 2));
    writeFileSync(postsPath, JSON.stringify(result.posts, null, 2));
    writeFileSync(categoriesPath, JSON.stringify(result.categories, null, 2));
    writeFileSync(tagsPath, JSON.stringify(result.tags, null, 2));

    const summary = {
      parsedAt: new Date().toISOString(),
      xmlPath,
      totalPages: result.pages.length,
      totalPosts: result.posts.length,
      totalCategories: result.categories.length,
      totalTags: result.tags.length,
      pages: result.pages.map(p => ({ title: p.title, slug: p.slug, date: p.date })),
      posts: result.posts.map(p => ({ title: p.title, slug: p.slug, date: p.date, categories: p.categories })),
    };

    writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log('\n✅ XML parsing complete!');
    console.log(`\n📁 Files saved:`);
    console.log(`   ${pagesPath}`);
    console.log(`   ${postsPath}`);
    console.log(`   ${categoriesPath}`);
    console.log(`   ${tagsPath}`);
    console.log(`   ${summaryPath}`);

  } catch (error) {
    console.error('❌ Error parsing XML:', error);
    process.exit(1);
  }
}

main();
