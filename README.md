# Alex Tran Portfolio

A blazing-fast, static, and highly-interactive personal portfolio featuring 3D glassmorphic cards and a custom UMAP particle simulation background physics engine. Built without thick frontend frameworks to ensure maximum performance and total control over layout rendering.

## Directory Structure

The repository has been neatly organized for production deployment:

```
/
├── index.html        # The final compiled static site (Do not edit directly)
├── README.md         # This documentation
├── assets/
│   └── media/        # Images, profile pictures, and showcase videos
├── css/
│   └── styles.css    # Core styling, glassmorphism UI, and custom variables
├── js/
│   └── script.js     # UMAP Physics simulation and 3D hover tracking logic
└── cms/
    ├── cms.py        # Local Python CMS server/builder
    └── content.json  # Your portfolio text data source
```

## How to Edit Your Website

This portfolio uses a completely local Python-based Custom CMS. Instead of manually editing the HTML, you can edit your content through a graphical web interface.

1. **Start the Builder**
   Open your terminal in this repository and run:
   ```bash
   cd cms
   python3 cms.py
   ```
2. **Open the Dashboard**
   Navigate to [http://localhost:5000](http://localhost:5000) in your web browser.
3. **Save and Deploy**
   Modify the JSON data fields in the interface and click the **Deploy to Website 🚀** button. The script will instantly regenerate the `index.html` file at the root of the project with your new data.

## Deployment

Because the final output is just pure HTML/CSS/JS (`index.html`, `css/styles.css`, `js/script.js`), it is fully decoupled from the Python background engine.

You can instantly deploy this folder for free on:
- **GitHub Pages**
- **Vercel**
- **Netlify**

Just push this folder to your Git repository, and it will automatically go live.
