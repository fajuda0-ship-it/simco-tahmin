import requests
import json
import os

def get_price():
    url = "https://api.simcotools.com/v1/realms/0/market/prices"
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        data = response.json()
        for item in data:
            if str(item.get("resourceId")) == "114" and str(item.get("quality")) == "0":
                return item.get("price")
        return "Bulunamadı"
    except Exception as e:
        return f"Hata: {e}"

# Fiyatı al ve 'data.json' dosyasına kaydet
current_price = get_price()
with open("data.json", "w") as f:
    json.dump({"price": current_price}, f)

print(f"İşlem Tamam: {current_price}")
