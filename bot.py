from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time

def get_price_with_selenium():
    chrome_options = Options()
    chrome_options.add_argument("--headless") # Ekran açmadan çalışması için şart
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Fiyatın olduğu asıl sayfa linkini buraya koy (API değil, normal web sayfası)
        url = "https://www.simcotools.com/market/prices" 
        driver.get(url)
        
        # Sayfanın yüklenmesi için 5 saniye bekle
        time.sleep(5) 
        
        # BURASI KRİTİK: Sayfadaki fiyatın olduğu yerin 'ID'sini veya 'Class'ını bulmalıyız.
        # Örnek: Eğer fiyat <span class="price">895</span> içindeyse:
        # price_element = driver.find_element(By.CLASS_NAME, "price")
        
        # Şimdilik debug için sayfa kaynağında 114'ü arayalım:
        page_content = driver.page_source
        # (Burada fiyatı çekmek için sayfanın HTML yapısını bilmemiz lazım)
        
        # Örnek sabit değer (Sayfayı inceleyip CSS Selector yazacağız):
        price = "895" # Burayı selector ile bağlayacağız
        
        return price
    except Exception as e:
        return f"Selenium Hatası: {str(e)[:50]}"
    finally:
        driver.quit()

# Kaydet
current_price = get_price_with_selenium()
with open("data.json", "w") as f:
    json.dump({"price": current_price}, f)
