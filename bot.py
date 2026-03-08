import os
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def get_price():
    chrome_options = Options()
    chrome_options.add_argument("--headless") # Ekran açılmasın (GitHub için şart)
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        # Fiyatların olduğu ana tablo sayfası
        driver.get("https://www.simcotools.com/market/prices")
        time.sleep(10) # Sayfanın ve JavaScript'in tamamen yüklenmesi için bekliyoruz

        # Sayfa içindeki tüm metni tarayıp Robot 114 ve yanındaki fiyatı arıyoruz
        # (Selector bulamadığımız için en sağlam yol: Sayfa kaynağında regex)
        page_source = driver.page_source
        
        # Simco'nun HTML yapısına göre fiyatı cımbızla çekiyoruz
        import re
        # Bu regex, 114 numaralı id'den sonra gelen ilk fiyat kalıbını arar
        match = re.search(r'114.*?(\d{3,4})', page_source)
        
        if match:
            return match.group(1)
        else:
            return "Fiyat Bulunamadı"

    except Exception as e:
        return f"Hata: {str(e)[:50]}"
    finally:
        driver.quit()

# Veriyi kaydet
price = get_price()
with open("data.json", "w") as f:
    json.dump({"price": price}, f)

print(f"Selenium Sonucu: {price}")
