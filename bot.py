import os
import json
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def get_price():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    # SSL Hatalarını Aşmak İçin Eklenen Ayarlar:
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--ignore-ssl-errors')
    chrome_options.add_argument('--allow-insecure-localhost')
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        # API yerine direkt fiyatların listelendiği ana sayfaya gitmek daha garantidir
        url = "https://www.simcotools.com/market/prices"
        driver.get(url)
        
        # Sayfanın yüklenmesi için biraz daha fazla bekle (Simco yavaş olabilir)
        time.sleep(15) 

        page_source = driver.page_source
        
        # Regex ile 114 (Robot) id'sini ve peşindeki fiyatı (3-4 haneli rakam) ara
        # Örnek: "resourceId":114 ... "price":895
        match = re.search(r'114.*?price.*?(\d{2,5})', page_source)
        
        if match:
            return match.group(1)
        else:
            # Eğer bulamazsa, belki sayfa yapısı farklıdır, ham veriden bir parça alalım
            print("Ekranda 114 bulunamadı, sayfa yapısı değişmiş olabilir.")
            return "Bulunamadı"

    except Exception as e:
        return f"Hata: {str(e)[:30]}"
    finally:
        driver.quit()

price = get_price()
with open("data.json", "w") as f:
    json.dump({"price": price}, f)

print(f"Sonuç: {price}")
