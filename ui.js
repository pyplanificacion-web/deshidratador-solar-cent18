// Mobile nav
const menuBtn=document.getElementById('menuBtn');
const mainNav=document.getElementById('mainNav');
menuBtn?.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));

// Gallery (only photos; video intentionally excluded)
const gallery=[
  ['assets/gallery/hero.jpg','Prototipo terminado al aire libre.'],
  ['assets/gallery/rear-open.jpg','Vista posterior: acceso a las tres bandejas.'],
  ['assets/gallery/rear-trays.jpg','Bandejas extraíbles y cámara de secado.'],
  ['assets/gallery/sun-side.jpg','Vista lateral con exposición directa al Sol.'],
  ['assets/gallery/side-view.jpg','Perfil del equipo y sombra proyectada.'],
  ['assets/gallery/inside-banana.jpg','Banana distribuida dentro del gabinete durante el ensayo.'],
  ['assets/gallery/fresh-banana.jpg','Distribución inicial de banana sobre las bandejas.'],
  ['assets/gallery/scale-empty.jpg','Control de tara del recipiente utilizado en las pesadas.'],
  ['assets/gallery/scale-fresh.jpg','Pesada inicial de la banana fresca.'],
  ['assets/gallery/scale-final.jpg','Producto después del proceso de deshidratación.']
];
let gIndex=0, touchX=null;
const gImg=document.getElementById('galleryImage'), gCap=document.getElementById('galleryCaption'), gCount=document.getElementById('galleryCounter'), dots=document.getElementById('galleryDots');
function renderGallery(){
  const [src,cap]=gallery[gIndex]; gImg.src=src; gImg.alt=cap; gCap.textContent=cap; gCount.textContent=`${gIndex+1} / ${gallery.length}`;
  [...dots.children].forEach((d,i)=>d.classList.toggle('active',i===gIndex));
}
gallery.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Ir a foto ${i+1}`);b.addEventListener('click',()=>{gIndex=i;renderGallery()});dots.appendChild(b)});
document.getElementById('galleryPrev').onclick=()=>{gIndex=(gIndex-1+gallery.length)%gallery.length;renderGallery()};
document.getElementById('galleryNext').onclick=()=>{gIndex=(gIndex+1)%gallery.length;renderGallery()};
const carousel=document.getElementById('carousel');
carousel.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')document.getElementById('galleryPrev').click();if(e.key==='ArrowRight')document.getElementById('galleryNext').click()});
carousel.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});
carousel.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50)(dx<0?document.getElementById('galleryNext'):document.getElementById('galleryPrev')).click();touchX=null},{passive:true});
renderGallery();
const lightbox=document.getElementById('lightbox');
document.getElementById('zoomBtn').onclick=()=>{document.getElementById('lightboxImg').src=gallery[gIndex][0];document.getElementById('lightboxCaption').textContent=gallery[gIndex][1];lightbox.showModal()};
document.getElementById('closeLightbox').onclick=()=>lightbox.close();
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});


// Graceful fallback if the 3D module cannot be loaded.
setTimeout(()=>{const l=document.getElementById('loading3d');if(l&&l.isConnected){l.textContent='El laboratorio 3D requiere conexión a Internet para cargar Three.js.';}},7000);
