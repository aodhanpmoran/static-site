const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from multiple directories
app.use(express.static('src'));
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Handle routes for HTML files
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'src', `${page}.html`), (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'src', 'index.html'));
        }
    });
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 