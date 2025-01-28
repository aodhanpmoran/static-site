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
    const template = await fs.readFile('./src/templates/base.html', 'utf-8');
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
    await ensureDir('./public/styles');
    await ensureDir('./public/scripts');
    await fs.copyFile('./src/styles/main.css', './public/styles/main.css');
    // Copy scripts if they exist
    try {
        await fs.copyFile('./src/scripts/main.js', './public/scripts/main.js');
    } catch (err) {
        console.log('No scripts to copy yet');
    }
}

async function build() {
    try {
        const template = await readTemplate();
        
        // Ensure public directory exists
        await ensureDir('./public');
        
        // Process content directory
        const contentDir = './src/content';
        const files = await fs.readdir(contentDir);
        
        for (const file of files) {
            if (path.extname(file) === '.md') {
                const { attributes, html } = await processMarkdown(path.join(contentDir, file));
                const outputPath = path.join('./public', file.replace('.md', '.html'));
                const finalHtml = await buildPage(template, html, attributes);
                await fs.writeFile(outputPath, finalHtml);
            }
        }
        
        // Copy assets
        await copyAssets();
        
        console.log('Build completed successfully!');
    } catch (err) {
        console.error('Build failed:', err);
    }
}

build(); 