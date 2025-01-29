const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

// Configure marked for security
marked.setOptions({
    headerIds: false,
    mangle: false
});

async function readTemplate() {
    const template = await fs.readFile('./index.html', 'utf-8');
    return template;
}

async function processMarkdown(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const { attributes, body } = frontMatter(content);
    const html = marked.parse(body);
    return { attributes, html };
}

async function buildPage(template, content, data) {
    let page = template.replace('{{content}}', content);
    page = page.replace('{{title}}', data.title || 'Castcraft co.');
    return page;
}

async function ensureDir(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

async function copyAssets() {
    await ensureDir('./styles');
    await ensureDir('./scripts');
    // No need to copy files since they're already in the right place
}

async function build() {
    try {
        const template = await readTemplate();
        
        // Process content directory if it exists
        try {
            const contentDir = './content';
            const files = await fs.readdir(contentDir);
            
            for (const file of files) {
                if (path.extname(file) === '.md') {
                    const { attributes, html } = await processMarkdown(path.join(contentDir, file));
                    const outputPath = path.join('./', file.replace('.md', '.html'));
                    const finalHtml = await buildPage(template, html, attributes);
                    await fs.writeFile(outputPath, finalHtml);
                }
            }
        } catch (err) {
            console.log('No content directory found, skipping markdown processing');
        }
        
        console.log('Build completed successfully!');
    } catch (err) {
        console.error('Build failed:', err);
    }
}

build(); 