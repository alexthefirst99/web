var editElements = $('.edit');
var pageId; // Unique identifier for the current HTML page
// put this near the top (after pageId is set)
const NON_EDITABLE_PAGES = new Set(['software', 'index']);


function generateUniqueId() {
  var currentPage = window.location.pathname.split("/").pop(); // Get the current page's filename
  pageId = currentPage.replace('.html', ''); // Use the filename as the page ID
  localStorage.setItem('pageId', pageId); // Save the identifier in localStorage
}

function myFunction() {
  if (NON_EDITABLE_PAGES.has(pageId)) {
    alert("This page is not editable.");
    return;
  }
  let pass = prompt("Please enter your password");
  if (pass == "000") {
    alert("Recommend edit content in Microsoft Word, then copy to website.\n • Big heading: font: Source Serif Pro, size: 37.5 \n • Small heading: font:Source Serif Pro, size 21. \n • Text: font:Calibri Light (Headings), size 12 \n\nAfter edit, click save and upload the downloaded file in ./js/json on github page ");
    editElements.attr('contentEditable', true);
    editElements.css('border', '1px solid blue');
  }
}

function mySave() {
  if (NON_EDITABLE_PAGES.has(pageId)) {
    alert("This page is not editable.");
    return;
  }

  var editedContents = [];

  editElements.each(function(index) {
    var editedContent = $(this).html();
    var key = 'newContent_' + pageId + '_' + (index + 1); // Include the pageId in the key
    localStorage.setItem(key, editedContent);

    // Auto-wrap any links
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var replacedContent = editedContent.replace(exp, function(match) {
      var link = '<u><a href="' + match + '" class="link">' + match + '</a></u>';
      var existingLinkCheck = '<u><a href="' + match + '" class="link">';
      if (editedContent.includes(existingLinkCheck)) {
        return match;
      } else {
        return link;
      }
    });

    editedContents.push(replacedContent);
  });

  // Save the array of contents as a JSON string
  var contentsJson = JSON.stringify(editedContents);
  var blob = new Blob([contentsJson], { type: 'application/json' });
  saveAs(blob, 'localStorageData_' + pageId + '.json'); // Include the pageId in the JSON file name

  editElements.attr('contenteditable', 'false');
  localStorage.removeItem('contentEditable');
  editElements.css('border', 'transparent');
}

function restoreContent() {
  if (NON_EDITABLE_PAGES.has(pageId)) return;

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

window.onload = () => {
  const anchors = document.querySelectorAll('a');
  const transition_el = document.querySelector('.transition');

  setTimeout(() => {
    generateUniqueId();

    if (NON_EDITABLE_PAGES.has(pageId)) {
      transition_el.classList.remove('is-active');
      return;
    }

    restoreContent();

    fetch('https://trantunhi99.github.io/web/js/json/localStorageData_' + pageId + '.json')
    // fetch('https://raw.githubusercontent.com/GuangyuWangLab/web/updated_web/js/json/localStorageData_' + pageId + '.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('JSON file not found');
        }
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
        var errorContainer = document.getElementById('error');
        if (errorContainer) {
          errorContainer.textContent = 'Error: JSON file not found.';
        }
      });
  }, 500);

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    anchor.addEventListener('click', e => {
      e.preventDefault();
      let target = e.target.href;
      transition_el.classList.add('is-active');
      setTimeout(() => {
        window.location.href = target;
      }, 500);
    });
  }
};





document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.reveal-card').forEach(function(card){
    const thumbImg = card.querySelector('.thumb img');
    const heroImg  = card.querySelector('.panel-hero-img');
    if (thumbImg && heroImg) {
      heroImg.src = thumbImg.src;       // show same image in modal
      heroImg.alt = thumbImg.alt || '';
    }
  });
})





(function(){
  const area  = document.querySelector('.showcase-area');
  const wrap  = document.querySelector('.showcase-image');
  const media = document.querySelector('.showcase-image video') || document.querySelector('.showcase-image img');
  const title = document.querySelector('.showcase-area .name');
  const sub   = document.querySelector('.showcase-area .heading_small');

  if(!area || !wrap || !media) return;

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  let ticking = false;

  function update(){
    ticking = false;

    const total = area.offsetHeight - window.innerHeight; // scrollable distance inside hero
    const start = area.offsetTop;
    const scrolled = window.scrollY - start;
    const p = clamp(scrolled / total, 0, 1); // 0 at top, 1 at end of hero

    // Read tunables from CSS
    const minScale = parseFloat(getComputedStyle(document.documentElement)
                      .getPropertyValue('--hero-min-scale')) || 0.88;
    const tyMax = parseFloat(getComputedStyle(document.documentElement)
                      .getPropertyValue('--hero-ty-max')) || 24;

    // Map progress -> transforms
    const scale = 1 - (1 - minScale) * p;   // 1 -> minScale
    const ty    = tyMax * p;                 // 0px -> tyMax
    const br    = 28 * p;                    // border radius grows slightly
    const shOpacity = 0.18 * p;              // shadow increases subtly

    media.style.setProperty('--hero-scale', scale.toFixed(4));
    media.style.setProperty('--hero-ty', ty.toFixed(1) + 'px');
    wrap.style.setProperty('--hero-br', br.toFixed(1) + 'px');
    wrap.style.setProperty('--hero-shadow', `0 30px 80px rgba(0,0,0,${shOpacity.toFixed(3)})`);

    // Fade the titles as we scroll through the hero
    const o = clamp(1 - p * 1.2, 0, 1);
    if (title){ title.style.opacity = o; title.style.transform = `translateY(${(-12 * p).toFixed(1)}px)`; }
    if (sub){   sub.style.opacity   = o; sub.style.transform   = `translateY(${(-8  * p).toFixed(1)}px)`; }
  }

  function onScroll(){
    if (!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  // Initial paint
  update();
  // Events
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
  document.querySelectorAll('.reveal-card .toggle').forEach(cb => {
    const card = cb.closest('.reveal-card');
    cb.addEventListener('change', () => card.classList.toggle('open', cb.checked));
  });

  
