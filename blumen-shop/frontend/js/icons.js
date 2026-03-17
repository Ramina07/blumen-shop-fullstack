(function(){
  const logo = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s7-4.2 7-10a7 7 0 0 0-14 0c0 5.8 7 10 7 10Z" stroke="rgba(6,32,18,.9)" stroke-width="2"/>
    <path d="M12 8c-1.7-2-4-.6-4 1.4 0 2.6 4 4.6 4 4.6s4-2 4-4.6C16 7.4 13.7 6 12 8Z" fill="rgba(6,32,18,.9)"/>
  </svg>`;
  const search = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="18" height="18">
    <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="rgba(236,245,239,.85)" stroke-width="2"/>
    <path d="M16.5 16.5 21 21" stroke="rgba(236,245,239,.85)" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

  function put(id, html){
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  put("logoSlot", logo);
  put("searchIcon", search);
})(); 
