// Mobile nav
const menuBtn=document.getElementById('menuBtn');
const mainNav=document.getElementById('mainNav');
menuBtn?.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));

// Gallery: every photo from the shared Drive gallery. Videos are intentionally excluded.
const drivePhotoIds=[
'1TdCBmRkmOL8U4NnO48pb7RkmB6LjttC-','1nbLbT7vixbyem_vtonGqGvyJikFHsP6I','1qe4g-DD6GHhp3mGw-6WWROleT1OLF3hn','1IDbS5SLE0hvHiZJfeoNAWs2eqNwTIfAg',
'1kjv5Lk3i2xdGasTPT3uWuofFe0IzJ2sF','1kwoskISSTlv7WbUEMWWEzYf2H7fTXSFG','1YmuZgF91MQItLb0PkOW-XQKyiOj-nds4','1cFMu6l4sqTozn5x1pH_zyT8xfZzZaryv',
'1LjcLl6jis0Xmhc73rvv8CAamRW9_vBtC','1QoQ3OYIcR4ps5MLXLlqW4okD1cRGmgpc','18nKFqSIGZEolhKP2ypgvOrLINBw918MQ','1LkEXIklyRCBzrX8B-CKzzQRy9w5p9NgD',
'1SAZOm19tetvbzkU4dehmM4kvW33bpkar','1boBeG9mwulHOJm7uf2zNhP0d2dwvWMps','1tpXR9NUexW8KtvA7L9RmJ-vQ8nRzocjO','14zLSZ75579ugeUqeRel3F31OJXq0psN0',
'1XCBsnV-z5eOfNjAELlm7QomLzSxT7Dl1','1otnc25B_BGapFDzWSG_0668p9yKd2Qo5','1uOwpa2Y7U520ebB2m_gEZ0u3dDH4JjXj','1lhqXCbv4iOE2dHTcnbjUOi5anAbgcplj',
'1a1i-VJ3aXxBYlNYkQIland1ZMmy21a2Q','1Gw_jlj2IlwBkCB7cu1OJNshaTqfox9-X','1vQfWW7EA_fzHE0EHHQ1bT7hWzVh9Q1Wz','1WGamv1g0jDhD3RVaVl43mVCcctLJRL96',
'1zB3tkxXbcirzv-vKRmnP4WqASsu6Loz6','17yKkioH_4-EaePqj1WBmW8UDCd5VgUnb','1LQJ4strScqb0iXyvrflODpzROVu2nfgm','1nNNTeIumqe5wuqRzDlxJ2d_WYlZkmhtu',
'1UlGJNUg_Qn8GDmGf_Z5evuH8aYa5f0o3','10jxoNIrEnondTBU-hj4jOAO2WYClzQYJ','1P3nAp9c-FSnRucUfEERG-TIZaba1p2xc','11_XIHkcKirVOlF65Ixr-6ILgJ3qCgZWg',
'1vMROhNEP6SDiMy-Iu-MNTwnR6juBZ3xJ','1IG3WKxYNS4mP1en0_3DVX5tK0nG1x7WJ','1d8W9-QskksVW6CuN_FYyRxlm-wC0IHDB','1ovOwnO6WZ1CnjINXfgRLmvjyEm2-i0r8',
'1BJGELKKE6NhpWQXCqyAOWb6mIzY-5Tnq','1USs5W29rJeQJ2nkrMHf4cnjf13-tfczg','16ydeB-iw-UwpzgQ79Ja6fF2q9b0TqpIH','1ZrcNngoDSGIOaOOCZ_afD8aL2LfJNEQ7',
'14S4_BXAxs4e2HiSDI076NW-Zni5U5zQp','14SPoMBLVq1BjjJ6yo9CsweAYRN3fbFwE','14m4c6mPV1cBcI1o7F8ofRuwv9Q9HVjo3','1BVVCPFoQ0wS8EzqXEmZ0YC_PlPTCZrYt',
'1naKZ1nHo7i_aNB1x7SPIs38jp8k3lInh','1azlhMIhQUUYrnqB4Id1B-krwBODcnVQH','1eNPp6sdBSfYgq3YfIbUN30PfHCnFVR5k','1_b3p6vrv2UWI_B9ou4IulrPKDf6LXcxY',
'1Jn5JOe60A0ARs1Btkn2-mY0Adq5k8ReA','1fWiJzACDrcEqIy6mvThIu7wY6cmnaw0_','1kGmSy6P0D3LiVNDs-jujOV3vUzMMcOeZ','1D7cdGVSNpMWGn0PEktZjPy7GJ_lcH4_t'
];
const gallery=drivePhotoIds.map((id,i)=>[
  `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
  `Fotografía ${i+1} de ${drivePhotoIds.length}`
]);
let gIndex=0, touchX=null;
const gImg=document.getElementById('galleryImage'), gCap=document.getElementById('galleryCaption'), gCount=document.getElementById('galleryCounter'), dots=document.getElementById('galleryDots');
function renderGallery(){
  const [src,cap]=gallery[gIndex];
  if(gImg){gImg.src=src;gImg.alt=cap;}
  if(gCap)gCap.textContent=cap;
  if(gCount)gCount.textContent=`${gIndex+1} / ${gallery.length}`;
  if(dots)[...dots.children].forEach((d,i)=>d.classList.toggle('active',i===gIndex));
}
if(dots){gallery.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Ir a foto ${i+1}`);b.addEventListener('click',()=>{gIndex=i;renderGallery()});dots.appendChild(b)});}
document.getElementById('galleryPrev')?.addEventListener('click',()=>{gIndex=(gIndex-1+gallery.length)%gallery.length;renderGallery()});
document.getElementById('galleryNext')?.addEventListener('click',()=>{gIndex=(gIndex+1)%gallery.length;renderGallery()});
const carousel=document.getElementById('carousel');
carousel?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')document.getElementById('galleryPrev')?.click();if(e.key==='ArrowRight')document.getElementById('galleryNext')?.click()});
carousel?.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});
carousel?.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50)(dx<0?document.getElementById('galleryNext'):document.getElementById('galleryPrev'))?.click();touchX=null},{passive:true});
renderGallery();
const lightbox=document.getElementById('lightbox');
document.getElementById('zoomBtn')?.addEventListener('click',()=>{document.getElementById('lightboxImg').src=gallery[gIndex][0];document.getElementById('lightboxCaption').textContent=gallery[gIndex][1];lightbox?.showModal()});
document.getElementById('closeLightbox')?.addEventListener('click',()=>lightbox?.close());
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});

// Digital recipe book — 13 pages, two-page spread on desktop and one page on mobile.
const BOOK_PAGES=13;
let bookIndex=0;
const bookSpread=document.getElementById('bookSpread');
const bookLeft=document.getElementById('bookPageLeft');
const bookRight=document.getElementById('bookPageRight');
const bookCounter=document.getElementById('bookCounter');
const bookShell=document.getElementById('bookShell');
const mobileBook=()=>window.matchMedia('(max-width:760px)').matches;
const pageSrc=n=>`assets/recipe-pages/page-${String(n).padStart(2,'0')}.jpg`;
function animateBook(){
  if(!bookSpread)return;
  bookSpread.classList.add('turning');
  setTimeout(()=>bookSpread.classList.remove('turning'),240);
}
function renderBook(){
  const mobile=mobileBook();
  const leftPage=bookIndex+1;
  const rightPage=bookIndex+2;
  if(bookLeft){bookLeft.src=pageSrc(leftPage);bookLeft.alt=`Página ${leftPage} del recetario`;bookLeft.parentElement.classList.remove('empty');}
  if(bookRight){
    if(!mobile && rightPage<=BOOK_PAGES){bookRight.src=pageSrc(rightPage);bookRight.alt=`Página ${rightPage} del recetario`;bookRight.parentElement.classList.remove('empty');}
    else bookRight.parentElement.classList.add('empty');
  }
  if(bookCounter)bookCounter.textContent=mobile?`Página ${leftPage} / ${BOOK_PAGES}`:`Páginas ${leftPage}${rightPage<=BOOK_PAGES?'–'+rightPage:''} / ${BOOK_PAGES}`;
}
function bookStep(dir){
  const step=mobileBook()?1:2;
  bookIndex=Math.max(0,Math.min(BOOK_PAGES-1,bookIndex+dir*step));
  if(!mobileBook() && bookIndex%2===1)bookIndex-=1;
  animateBook();
  setTimeout(renderBook,90);
}
document.getElementById('bookPrev')?.addEventListener('click',()=>bookStep(-1));
document.getElementById('bookNext')?.addEventListener('click',()=>bookStep(1));
bookShell?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();bookStep(-1)}if(e.key==='ArrowRight'){e.preventDefault();bookStep(1)}});
let bookTouchX=null;
bookShell?.addEventListener('touchstart',e=>bookTouchX=e.changedTouches[0].clientX,{passive:true});
bookShell?.addEventListener('touchend',e=>{if(bookTouchX===null)return;const dx=e.changedTouches[0].clientX-bookTouchX;if(Math.abs(dx)>50)bookStep(dx<0?1:-1);bookTouchX=null},{passive:true});
document.getElementById('bookFullscreen')?.addEventListener('click',()=>{if(!document.fullscreenElement)bookShell?.requestFullscreen?.();else document.exitFullscreen?.();});
window.addEventListener('resize',()=>{if(bookIndex>=BOOK_PAGES)bookIndex=BOOK_PAGES-1;if(!mobileBook()&&bookIndex%2===1)bookIndex-=1;renderBook()});
renderBook();

// Graceful fallback if the 3D module cannot be loaded.
setTimeout(()=>{const l=document.getElementById('loading3d');if(l&&l.isConnected){l.textContent='El laboratorio 3D requiere conexión a Internet para cargar Three.js.';}},7000);
