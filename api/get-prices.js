export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await response.json();
    // Tarayıcının itiraz etmemesi için kapıyı sonuna kadar açıyoruz
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Veri çekilemedi' });
  }
}
