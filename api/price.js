export default async function handler(req, res) {
  try {
    // 1. Simco'dan tüm fiyatları çekiyoruz
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    const allData = await response.json();

    // 2. Senin verdiğin o meşhur filtreyi burada uyguluyoruz
    const robot = allData.find(item => item.resourceId === 114 && item.quality === 0);

    // 3. Tarayıcı engeline takılmamak için izin veriyoruz
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (robot) {
      // GitHub'a SADECE fiyatı gönderiyoruz. Örn: {"price": 900}
      res.status(200).json({ price: robot.price });
    } else {
      res.status(404).json({ error: 'Robot 114 bulunamadi' });
    }

  } catch (error) {
    res.status(500).json({ error: 'API Hatasi' });
  }
}
