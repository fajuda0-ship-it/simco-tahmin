export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      headers: { 'Cache-Control': 'no-cache' },
      next: { revalidate: 0 } // Vercel için önbelleği kapatır
    });
    
    const allData = await response.json();

    // DİKKAT: Robotu (114) daha buradayken buluyoruz!
    // Böylece GitHub tarafında hiçbir işlem yapmana gerek kalmaz.
    const robot = allData.find(item => item.resourceId === 114 && item.quality === 0);

    // Kapıyı açıyoruz (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (robot) {
      res.status(200).json({ price: robot.price });
    } else {
      res.status(404).json({ error: 'Robot 114 bulunamadı' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Simco Baglanti Hatasi' });
  }
}
