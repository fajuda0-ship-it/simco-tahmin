export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const rawData = await response.json();

    // VERİ AYIKLAMA: Veri doğrudan liste değilse içini kontrol et
    let list = Array.isArray(rawData) ? rawData : (rawData.contents || []);

    // Senin istediğin o satıra kilitleniyoruz
    const item = list.find(i => i.resourceId == 114 && i.quality == 0);

    if (item) {
      // 895 rakamını buradan gönderiyoruz
      res.status(200).json({ price: item.price });
    } else {
      res.status(200).json({ price: "Bulunamadı" });
    }
  } catch (e) {
    res.status(200).json({ price: "Bağlantı Hatası" });
  }
}
