export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.simcotools.com/v1/realms/0/market/prices");
    const json = await response.json();

    const data = json.data || json;

    const item = data.find(
      (i) => i.resourceId === 114 && i.quality === 0
    );

    res.status(200).json({
      price: item ? item.price : "not found"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
