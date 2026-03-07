import requests
import json

def get_price():
    url = "https://api.simcotools.com/v1/realms/0/market/prices"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        # Yanıt boş mu veya hatalı mı kontrol et
        if response.status_code != 200:
            return f"Simco Hatası: {response.status_code}"
            
        data = response.json()
        
        # Hatanın sebebi burası: Verinin liste olduğundan emin olmalıyız
        if isinstance(data, list):
            for item in data:
                # 'item' bir sözlük (dictionary) mi kontrol et
                if isinstance(item, dict):
                    if str(item.get("resourceId")) == "114" and str(item.get("quality")) == "0":
                        return item.get("price")
            return "Robot 114 Bulunamadı"
        else:
            return "Veri Formatı Hatalı (Liste Değil)"
            
    except Exception as e:
        return f"Sistem Hatası: {str(e)[:50]}"

# Fiyatı al ve 'data.json' dosyasına güvenli bir şekilde kaydet
current_price = get_price()
with open("data.json", "w", encoding="utf-8") as f:
    json.dump({"price": current_price}, f, ensure_ascii=False)

print(f"İşlem Sonucu: {current_price}")
