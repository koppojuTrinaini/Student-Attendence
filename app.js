// Small script to show minimal interactivity
document.addEventListener('DOMContentLoaded',()=>{
  const links = document.querySelectorAll('.btn');
  links.forEach(a=>a.addEventListener('click', (e)=>{
    // Let link behave normally; add tiny feedback
    a.animate([{opacity:1},{opacity:0.6},{opacity:1}],{duration:250});
  }));
});