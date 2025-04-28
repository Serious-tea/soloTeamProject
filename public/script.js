async function loadAds() {
    const res = await fetch('/ads');
    const ads = await res.json();
    const container = document.getElementById('adsContainer');
    container.innerHTML = '';
  
    ads.forEach(ad => {
      const el = document.createElement('div');
      el.className = 'ad';
      el.id = `ad-${ad.id}`;
      el.innerHTML = `
        <strong>${ad.title}</strong>
        <span class="delete" onclick="deleteAd(${ad.id})">видалити</span>
        <p>${ad.content}</p>
      `;
      container.appendChild(el);
    });
  }
  
  async function deleteAd(id) {
    await fetch(`/ads/${id}`, { method: 'DELETE' });
    loadAds();
  }
  
  document.getElementById('searchInput').addEventListener('input', e => {
    const title = e.target.value.toLowerCase();
    const ad = [...document.querySelectorAll('.ad')].find(ad => 
      ad.querySelector('strong').textContent.toLowerCase().includes(title)
    );
    if (ad) ad.scrollIntoView({ behavior: 'smooth' });
  });
  
  loadAds();
  