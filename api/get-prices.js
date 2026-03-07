export default async function handler(req, res) {
  const response = await fetch('https://api.simcotools.com/v1/realms/0/market/prices');
  const data = await response.json();
  res.status(200).json(data);
}
