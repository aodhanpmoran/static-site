const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the src directory
app.use(express.static('src'));

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