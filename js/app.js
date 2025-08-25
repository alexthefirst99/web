// =========================
// Inline editor + save/restore/export
// =========================
var editElements = $('.edit');
var pageId;

function generateUniqueId() {
  var currentPage = window.location.pathname.split("/").pop();
  pageId = currentPage.replace('.html', '');
  localStorage.setItem('pageId', pageId);
}

function myFunction() {
  let pass = prompt("Please enter your password");
  if (pass === "000") {
    alert("Recommend edit content in Microsoft Word, then copy to website.\n • Big heading: font: Source Serif Pro, size: 37.5 \n • Small heading: font:Source Serif Pro, size 21. \n • Text: font:Calibri Light (Headings), size 12 \n\nAfter edit, click save and upload the downloaded file in ./js/json on github page ");
    
    editElements.attr('contentEditable', true);
    editElements.css('border', '1px solid blue');

    document.getElementById('saveBtn').style.display = 'inline-block';
    document.getElementById('disableBtn').style.display = 'inline-block';
    document.getElementById('enableBtn').style.display = 'inline-block';
    document.getElementById('exportBtn').style.display = 'inline-block';
  } else {
    alert("Incorrect password.");
  }
}

function mySave() {
  var editedContents = [];

  editElements.each(function(index) {
    var html = $(this).html();
    var key = 'newContent_' + pageId + '_' + (index + 1);
    localStorage.setItem(key, html);
    editedContents.push(html);
  });

  var contentsJson = JSON.stringify(editedContents);
  var blob = new Blob([contentsJson], { type: 'application/json' });
  saveAs(blob, 'localStorageData_' + pageId + '.json');

  alert("Content saved and exported to JSON.");
  editElements.attr('contenteditable', 'false');
  editElements.css('border', 'transparent');
}

function restoreContent() {
  editElements.each(function(index) {
    var key = 'newContent_' + pageId + '_' + (index + 1);
    var savedContent = localStorage.getItem(key);
    if (savedContent) {
      $(this).html(savedContent);
    }
  });

  var importedData = localStorage.getItem('importedData');
  if (importedData) {
    var parsedData = JSON.parse(importedData);
    editElements.each(function(index) {
      $(this).html(parsedData[index]);
    });
  }
}

function disableRestore() {
  localStorage.setItem('global_disableRestore', 'true');
  alert("Restore from JSON is now disabled for ALL pages. Reload to see hard-coded HTML.");
}

function enableRestore() {
  localStorage.removeItem('global_disableRestore');
  alert("Restore from JSON is now enabled for ALL pages. Reload the page to apply changes.");
}

function exportEditedHTML() {
  let fullHTML = document.documentElement.cloneNode(true);

  $(fullHTML).find('.edit').each(function(index) {
    var key = 'newContent_' + pageId + '_' + (index + 1);
    var savedContent = localStorage.getItem(key);
    if (savedContent) {
      this.innerHTML = savedContent;
    }
  });

  var serializer = new XMLSerializer();
  var fullHTMLString = '<!DOCTYPE html>\n' + serializer.serializeToString(fullHTML);
  var blob = new Blob([fullHTMLString], { type: 'text/html' });

  saveAs(blob, pageId + '_edited.html');
  alert("Full HTML page exported with saved edits.");
}

window.onload = () => {
  const anchors = document.querySelectorAll('a');
  const transition_el = document.querySelector('.transition');

  setTimeout(() => {
    generateUniqueId();

    const disable = localStorage.getItem('global_disableRestore');
    if (!disable) {
      restoreContent();

      fetch('https://trantunhi99.github.io/web/js/json/localStorageData_' + pageId + '.json')
      //fetch('http://localhost:8000/js/json/localStorageData_' + pageId + '.json')
        .then(response => {
          if (!response.ok) throw new Error('JSON file not found');
          return response.json();
        })
        .then(parsedData => {
          localStorage.setItem('importedData', JSON.stringify(parsedData));
          restoreContent();
          console.log('JSON file fetched and imported successfully.');
          transition_el.classList.remove('is-active');
        })
        .catch(error => {
          console.error('Error fetching JSON file:', error);
          const errorContainer = document.getElementById('error');
          if (errorContainer) errorContainer.textContent = 'Error: JSON file not found.';
        });
    } else {
      console.log("Restore from JSON is globally disabled.");
      transition_el.classList.remove('is-active');
    }
  }, 500);

  // Smooth transitions, but skip external/new-tab and hover-hint links
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    anchor.addEventListener('click', e => {
      const a = e.currentTarget;
      // Skip transition if link opens in new tab or is inside the hover-hint
      if (a.getAttribute('target') === '_blank' || a.closest('.hover-hint')) {
        return; // let the browser handle it (e.g., open DOI in new tab)
      }
      e.preventDefault();
      let target = a.href;
      transition_el.classList.add('is-active');
      setTimeout(() => {
        window.location.href = target;
      }, 500);
    });
  }
};

// =========================
// Image slider + paper link (auto-play, hover pause only)
// =========================

// Map each image to its paper link
const slides = [
  { src: "./assets/Thor_framework.png",        href: "https://doi.org/10.1038/s41467-025-62593-1", label: "Thor" },
  { src: "./assets/loki_framework.png",        href: "https://doi.org/10.1038/s41592-025-02707-1", label: "Loki" },
  { src: "./assets/cell_dancer_framework.png", href: "https://doi.org/10.1038/s41587-023-01728-5", label: "cellDancer" }
];

let currentIndex = 0;
let autoTimer = null;
let isHovering = false;

const hint = document.querySelector('.hover-hint');
const container = document.querySelector('.slider-container');
const img = document.getElementById('slide-img');

function setSlide(index) {
  currentIndex = ((index % slides.length) + slides.length) % slides.length;
  img.src = slides[currentIndex].src;
  updateHintLink();
}

function updateHintLink() {
  const { href, label } = slides[currentIndex] || {};
  hint.innerHTML = href
    ? `<a href="${href}" target="_blank" rel="noopener">${label}</a>`
    : `<span>No paper link available</span>`;
}

function showHintNow(duration = 1600) {
  hint.classList.add('show');
  setTimeout(() => {
    if (!isHovering) hint.classList.remove('show');
  }, duration);
}

function changeSlide(direction) {
  img.style.opacity = 0;
  setTimeout(() => {
    setSlide(currentIndex + direction);
    img.style.opacity = 1;
    showHintNow(); // show hint whenever slide changes
  }, 300);
}

function startAuto(intervalMs = 5000) {
  stopAuto();
  autoTimer = setInterval(() => changeSlide(1), intervalMs);
}

function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

// Hover pause only — no slide change on hover
if (container) {
  container.addEventListener('mouseenter', () => {
    isHovering = true;
    stopAuto();                 // pause auto-advance
    hint.classList.add('show'); // keep hint visible
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;
    hint.classList.remove('show');
    startAuto(5000);            // resume auto-advance
  });
}

// Initial sync + auto start
window.addEventListener('load', () => {
  if (img && slides.length) {
    const found = slides.findIndex(s => img.src.endsWith(s.src) || img.src === s.src);
    setSlide(found >= 0 ? found : 0);
  }
  setTimeout(() => showHintNow(), 800); // gentle nudge after load
  startAuto(5000);                      // auto-advance every 7s
});

// Expose for buttons/arrows if needed
window.changeSlide = changeSlide;

