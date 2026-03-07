export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await response.json();

    // Veri bazen bir objenin içindeki 'contents'te olabilir, onu sağlama alıyoruz
    const list = Array.isArray(data) ? data : (data.contents || []);

    // FİLTRE: Hem sayı hem metin ihtimaline karşı tırnaksız kontrol (==)
    // Ayrıca verinin içinde 114 var mı diye konsola da yazdıralım (debug için)
    const item = list.find(i => String(i.resourceId) === "114" && String(i.quality) === "0");

    if (item) {
      // 895 rakamını yakaladık!
      res.status(200).json({ price: item.price });
    } else {
      // Eğer hala bulamazsa, listenin ilk elemanını gönder ki ne geldiğini görelim
      res.status(200).json({ 
        price: "Bulunamadı", 
        debug: list.length > 0 ? "Liste dolu ama 114 yok" : "Liste tamamen boş" 
      });
    }
  } catch (e) {
    res.status(500).json({ price: "Bağlantı Hatası" });
  }
}
