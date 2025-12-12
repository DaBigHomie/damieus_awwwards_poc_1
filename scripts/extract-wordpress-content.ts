/**
 * WordPress GraphQL Content Extractor
 * Extracts services, pages, posts, and media using WPGraphQL plugin
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const WP_GRAPHQL_ENDPOINT = 'http://damieus-com-restore.local/graphql';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  categories: {
    nodes: Array<{ name: string }>;
  };
}

interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
}

async function queryGraphQL<T>(query: string): Promise<T> {
  const response = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL');
  }

  return result.data;
}

async function extractServices() {
  console.log('🔍 Extracting services...');
  
  const query = `
    query GetServices {
      services(first: 100) {
        nodes {
          id
          title
          slug
          content
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          serviceFields {
            price
            duration
            capabilities
            technologies
            benefits
            processSteps
          }
        }
      }
    }
  `;

  try {
    const data = await queryGraphQL<{ services: { nodes: Service[] } }>(query);
    console.log(`✅ Found ${data.services.nodes.length} services`);
    return data.services.nodes;
  } catch (error) {
    console.log('⚠️  Services query failed, trying pages with "service" category...');
    
    // Fallback: Try to get services from pages
    const fallbackQuery = `
      query GetServicePages {
        pages(first: 100, where: { search: "service" }) {
          nodes {
            id
            title
            slug
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `;
    
    const fallbackData = await queryGraphQL<{ pages: { nodes: Page[] } }>(fallbackQuery);
    console.log(`✅ Found ${fallbackData.pages.nodes.length} service pages`);
    return fallbackData.pages.nodes;
  }
}

async function extractPages() {
  console.log('📄 Extracting pages...');
  
  const query = `
    query GetPages {
      pages(first: 100) {
        nodes {
          id
          title
          slug
          content
          parent {
            node {
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const data = await queryGraphQL<{ pages: { nodes: Page[] } }>(query);
  console.log(`✅ Found ${data.pages.nodes.length} pages`);
  return data.pages.nodes;
}

async function extractPosts() {
  console.log('📝 Extracting posts...');
  
  const query = `
    query GetPosts {
      posts(first: 100) {
        nodes {
          id
          title
          slug
          content
          excerpt
          date
          categories {
            nodes {
              name
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const data = await queryGraphQL<{ posts: { nodes: Post[] } }>(query);
  console.log(`✅ Found ${data.posts.nodes.length} posts`);
  return data.posts.nodes;
}

async function extractMenus() {
  console.log('🧭 Extracting navigation menus...');
  
  const query = `
    query GetMenus {
      menus {
        nodes {
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
              order
            }
          }
        }
      }
    }
  `;

  const data = await queryGraphQL<{ menus: { nodes: Array<{ name: string; slug: string; menuItems: { nodes: MenuItem[] } }> } }>(query);
  console.log(`✅ Found ${data.menus.nodes.length} menus`);
  return data.menus.nodes;
}

async function extractMediaLibrary() {
  console.log('🖼️  Extracting media library...');
  
  const query = `
    query GetMedia {
      mediaItems(first: 1000) {
        nodes {
          id
          title
          sourceUrl
          altText
          mediaDetails {
            width
            height
            file
          }
          mimeType
        }
      }
    }
  `;

  const data = await queryGraphQL<{ mediaItems: { nodes: any[] } }>(query);
  console.log(`✅ Found ${data.mediaItems.nodes.length} media items`);
  return data.mediaItems.nodes;
}

async function main() {
  console.log('🚀 Starting WordPress GraphQL content extraction...\n');

  try {
    // Extract all content
    const [services, pages, posts, menus, media] = await Promise.all([
      extractServices(),
      extractPages(),
      extractPosts(),
      extractMenus(),
      extractMediaLibrary(),
    ]);

    // Save to JSON files
    const outputDir = join(process.cwd(), 'wordpress-extracted');
    
    writeFileSync(
      join(outputDir, 'services.json'),
      JSON.stringify(services, null, 2)
    );
    
    writeFileSync(
      join(outputDir, 'pages.json'),
      JSON.stringify(pages, null, 2)
    );
    
    writeFileSync(
      join(outputDir, 'posts.json'),
      JSON.stringify(posts, null, 2)
    );
    
    writeFileSync(
      join(outputDir, 'menus.json'),
      JSON.stringify(menus, null, 2)
    );
    
    writeFileSync(
      join(outputDir, 'media.json'),
      JSON.stringify(media, null, 2)
    );

    // Create summary
    const summary = {
      extracted: new Date().toISOString(),
      counts: {
        services: services.length,
        pages: pages.length,
        posts: posts.length,
        menus: menus.length,
        media: media.length,
      },
      serviceList: services.map((s: any) => ({
        title: s.title,
        slug: s.slug,
      })),
      menuStructure: menus.map((m: any) => ({
        name: m.name,
        items: m.menuItems.nodes.map((i: MenuItem) => i.label),
      })),
    };

    writeFileSync(
      join(outputDir, 'extraction-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n✅ Content extraction complete!');
    console.log(`📁 Files saved to: ${outputDir}/`);
    console.log(`\n📊 Summary:`);
    console.log(`   Services: ${services.length}`);
    console.log(`   Pages: ${pages.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Menus: ${menus.length}`);
    console.log(`   Media: ${media.length}`);

  } catch (error) {
    console.error('❌ Extraction failed:', error);
    process.exit(1);
  }
}

main();
