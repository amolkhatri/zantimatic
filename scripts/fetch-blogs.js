const { Client } = require("@notionhq/client")
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Initializing a client
const notion = new Client({
  auth: "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",
})

async function getBlockContent(blockId) {
  const response = await notion.blocks.children.list({
    block_id: blockId,
  });
  
  return response.results;
}

async function downloadImage(url, imagePath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer'
    });
    
    // Create directory if it doesn't exist
    const imageDir = path.dirname(imagePath);
    await fs.mkdir(imageDir, { recursive: true });
    
    // Save the image
    await fs.writeFile(imagePath, response.data);
    console.log(`Image downloaded: ${imagePath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return false;
  }
}

async function blocksToMarkdown(blocks, slug) {
  let markdown = '';
  let imageCounter = 1;
  
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph.rich_text.length) {
          markdown += block.paragraph.rich_text.map(text => text.plain_text).join('') + '\n\n';
        } else {
          markdown += '\n';
        }
        break;
      case 'heading_1':
        markdown += '# ' + block.heading_1.rich_text.map(text => text.plain_text).join('') + '\n\n';
        break;
      case 'heading_2':
        markdown += '## ' + block.heading_2.rich_text.map(text => text.plain_text).join('') + '\n\n';
        break;
      case 'heading_3':
        markdown += '### ' + block.heading_3.rich_text.map(text => text.plain_text).join('') + '\n\n';
        break;
      case 'bulleted_list_item':
        markdown += '- ' + block.bulleted_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
        break;
      case 'numbered_list_item':
        markdown += '1. ' + block.numbered_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
        break;
      case 'to_do':
        const checked = block.to_do.checked ? '[x]' : '[ ]';
        markdown += `- ${checked} ` + block.to_do.rich_text.map(text => text.plain_text).join('') + '\n';
        break;
      case 'image':
        try {
          const imageUrl = block.image.type === 'external' 
            ? block.image.external.url 
            : block.image.file.url;
          
          const imageCaption = block.image.caption.length 
            ? block.image.caption.map(text => text.plain_text).join('') 
            : '';
          
          // Create image filename
          const imageExtension = imageUrl.split('.').pop().split('?')[0]; // Get extension and remove query params
          const imageName = `image-${imageCounter}.${imageExtension}`;
          const relativeImagePath = `images/${slug}/${imageName}`;
          const fullImagePath = path.join(process.cwd(), 'public', relativeImagePath);
          
          // Download the image
          const success = await downloadImage(imageUrl, fullImagePath);
          
          if (success) {
            // Add image to markdown with caption if available
            markdown += `![${imageCaption}](${process.env.basePath}/${relativeImagePath})`;
            if (imageCaption) {
              markdown += `\n*${imageCaption}*`;
            }
            markdown += '\n\n';
            imageCounter++;
          } else {
            markdown += `[Image failed to download from ${imageUrl}]\n\n`;
          }
        } catch (error) {
          console.error('Error processing image block:', error);
          markdown += '[Error processing image]\n\n';
        }
        break;
      case 'code':
        markdown += '```' + (block.code.language || '') + '\n' + 
                   block.code.rich_text.map(text => text.plain_text).join('') + 
                   '\n```\n\n';
        break;
      // Add more block types as needed
    }
  }
  
  return markdown;
}

// Function to extract metadata from a Notion page
function extractMetadata(page) {
  const metadata = {
    title: page.properties.Title?.title[0]?.plain_text || 'Untitled',
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
  };

  // Extract other properties if they exist
  for (const [key, value] of Object.entries(page.properties)) {
    if (key === 'Title') continue; // Already handled

    switch (value.type) {
      case 'rich_text':
        metadata[key.toLowerCase()] = value.rich_text[0]?.plain_text || '';
        break;
      case 'date':
        metadata[key.toLowerCase()] = value.date?.start || '';
        break;
      case 'select':
        metadata[key.toLowerCase()] = value.select?.name || '';
        break;
      case 'multi_select':
        metadata[key.toLowerCase()] = value.multi_select.map(item => item.name);
        break;
      case 'checkbox':
        metadata[key.toLowerCase()] = value.checkbox;
        break;
      case 'number':
        metadata[key.toLowerCase()] = value.number;
        break;
      case 'status':
        metadata[key.toLowerCase()] = value.status.name;
        break;
      // Add other property types as needed
    }
  }

  return metadata;
}

// Function to create frontmatter from metadata
function createFrontmatter(metadata) {
  let frontmatter = '---\n';
  
  for (const [key, value] of Object.entries(metadata)) {
    if (Array.isArray(value)) {
      frontmatter += `${key}: [${value.map(item => `"${item}"`).join(', ')}]\n`;
    } else if (typeof value === 'string') {
      frontmatter += `${key}: "${value}"\n`;
    } else {
      frontmatter += `${key}: ${value}\n`;
    }
  }
  
  frontmatter += '---\n\n';
  return frontmatter;
}

// Function to create a slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .trim();
}

// Function to save content to a file
async function saveToFile(content, filename) {
  try {
    // Create the 'content' directory if it doesn't exist
    const contentDir = path.join(process.cwd(), 'content');
    try {
      await fs.mkdir(contentDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    const filePath = path.join(contentDir, filename);
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`File saved: ${filePath}`);
  } catch (error) {
    console.error(`Error saving file ${filename}:`, error);
  }
}

async function main() {
  const myPage = await notion.databases.query({
    database_id: "1bfc8a89eb2a8062af70f17df8c29e0d",
  })

  const allPages = myPage.results
  
  // Process each page
  for (const [index, page] of allPages.entries()) {
    console.log(`Processing page ${index + 1}: ${page.properties.Title?.title[0]?.plain_text || 'Untitled'}`);
    
    // Extract metadata
    const metadata = extractMetadata(page);
    
    // Create a slug based on the title
    const slug = createSlug(metadata.title);
    
    // Get the blocks that make up the page content
    const blocks = await getBlockContent(page.id);
    
    // Convert blocks to markdown
    const markdown = await blocksToMarkdown(blocks, slug);
    
    // Create frontmatter
    const frontmatter = createFrontmatter(metadata);
    
    // Combine frontmatter and content
    const fullContent = frontmatter + markdown;
    
    // Create a filename based on the title
    const filename = `${slug}.md`;
    
    // Save to file
    await saveToFile(fullContent, filename);
  }
  
  console.log('All pages processed and saved as markdown files.');
}

main().catch(error => {
  console.error("Error:", error);
});