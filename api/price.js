export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await response.json();
    
    // Senin verdiğin o spesifik bloğu buluyoruz
    const item = data.find(i => i.resourceId === 114 && i.quality === 0);

    if (item) {
      res.status(200).json({ price: item.price });
    } else {
      res.status(404).json({ error: "Robot 114 Bulunamadı" });
    }
  } catch (e) {
    res.status(500).json({ error: "Simco'ya bağlanılamadı" });
  }
}
