export default async function handler(req, res) {
  // Dışarıdan erişime izin ver
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    // 1. Simco'dan veriyi çek
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    const allData = await response.json();

    // 2. Kontrol: Gelen veri bir liste mi?
    if (!Array.isArray(allData)) {
      return res.status(200).json({ price: "Liste Hatası" });
    }

    // 3. KRİTİK NOKTA: Senin verdiğin ID 114 ve Kalite 0 filtrelemesi
    // "==" kullanarak tip farklarını (yazı/sayı) ortadan kaldırıyoruz
    const robot = allData.find(item => item.resourceId == 114 && item.quality == 0);

    if (robot) {
      // Sadece fiyatı gönder
      return res.status(200).json({ price: robot.price });
    } else {
      // Eğer listede 114 yoksa bunu bildir
      return res.status(200).json({ price: "114 Bulunamadı" });
    }

  } catch (error) {
    return res.status(200).json({ price: "Bağlantı Koptu" });
  }
}
