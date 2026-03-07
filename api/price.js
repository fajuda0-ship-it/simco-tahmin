export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Simco'yu kandırmak için gerçek bir tarayıcı gibi davranıyoruz (User-Agent)
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      return res.status(200).json({ price: "Erişim Engellendi", code: response.status });
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.contents || []);

    if (list.length === 0) {
      return res.status(200).json({ price: "Veri Gelmedi", debug: "Simco bos liste yolladi" });
    }

    const item = list.find(i => String(i.resourceId) === "114" && String(i.quality) === "0");

    if (item) {
      res.status(200).json({ price: item.price });
    } else {
      res.status(200).json({ price: "Bulunamadı" });
    }
  } catch (e) {
    res.status(200).json({ price: "Hata", detail: e.message });
  }
}
