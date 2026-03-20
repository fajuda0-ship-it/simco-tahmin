// Enerji Santrali - Senin verdiğin canlı verilere göre sabitler
const BinaVerileri = {
    enerji: {
        tabanUretim: 2382.03, // Seviye 1 ve %0 bonus için saatlik miktar
        birimIscilik: 0.173,   // Yuvarlanmamış gerçek işçilik (0.17 + 0.003 gibi düşün)
        hamMadde: 0           // Enerji için girdi maliyeti yoktur
    }
};

function hesapla() {
    // 1. Kullanıcı Girdilerini Al
    const lv = parseInt(document.getElementById('bina-lv').value) || 1;
    const bonusYuzde = parseFloat(document.getElementById('uretim-bonusu').value) || 0;
    const hamAdmin = parseFloat(document.getElementById('ham-admin').value) || 0;
    const cooBecerisi = parseFloat(document.getElementById('coo-skill').value) || 0;
    const hedefAdet = parseFloat(document.getElementById('hedef-adet').value) || 0;

    const aktifBina = BinaVerileri.enerji;

    // 2. Üretim Hızı Hesaplama (Mantık: Taban * Seviye * (1 + Bonus))
    // Örn: %2 bonus için 1.02 ile çarpıyoruz
    const saatlikUretim = (aktifBina.tabanUretim * lv) * (1 + (bonusYuzde / 100));
    
    // 3. Zaman Hesaplama (Hedef Adet / Saatlik Üretim)
    const gerekenSure = hedefAdet / saatlikUretim;

    // 4. Yönetim Gideri Hesaplama (Harsh Sachdev Etkisi)
    // %22.35'i %14.98'e çeken Harsh'ın katsayısını uyguluyoruz
    const indirimKatsayisi = 0.2456; 
    const netAdminOrani = Math.max(0, hamAdmin - (cooBecerisi * indirimKatsayisi));
    
    // 5. Birim ve Toplam Maliyet
    const birimYonetimMaliyeti = aktifBina.birimIscilik * (netAdminOrani / 100);
    const toplamBirimMaliyet = aktifBina.birimIscilik + birimYonetimMaliyeti + aktifBina.hamMadde;
    const toplamKasaCikisi = toplamBirimMaliyet * hedefAdet;

    // 6. Sonuçları Ekrana Bas
    document.getElementById('res-birim-maliyet').innerText = "$" + toplamBirimMaliyet.toFixed(3);
    document.getElementById('res-net-admin').innerText = "%" + netAdminOrani.toFixed(2);
    document.getElementById('res-sure').innerText = formatSure(gerekenSure);
    document.getElementById('res-toplam-maliyet').innerText = "$" + toplamKasaCikisi.toLocaleString(undefined, {minimumFractionDigits: 2});
}

// Süre formatlayıcı (Saat -> Gün Saat Dakika)
function formatSure(saat) {
    if (saat <= 0) return "0 dk";
    const d = Math.floor(saat / 24);
    const h = Math.floor(saat % 24);
    const m = Math.round((saat % 1) * 60);
    
    let sonuc = "";
    if (d > 0) sonuc += d + "g ";
    if (h > 0) sonuc += h + "s ";
    if (m > 0 || sonuc === "") sonuc += m + "dk";
    return sonuc;
}

// Dinleyicileri Kur
document.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', hesapla);
});

// Sayfa yüklendiğinde çalıştır
hesapla();
