export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const allData = await response.json();
    const robot = allData.find(item => item.resourceId === 114 && item.quality === 0);

    if (robot) {
      res.status(200).json({ price: robot.price });
    } else {
      res.status(200).json({ price: "Yok" });
    }
  } catch (error) {
    res.status(200).json({ price: "Hata" });
  }
}
