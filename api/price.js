// Enerji Santrali için senin verdiğin resmi veriler
const BinaVerileri = {
    enerji: {
        saatlikTabanUretim: 2382.03, // Seviye 1 ve %0 bonus için
        birimIscilik: 0.17,
        hamMadde: 0 // Enerji üretimi girdi istemez
    }
};

function hesapla() {
    // 1. Girdileri Al
    const lv = parseInt(document.getElementById('bina-lv').value) || 1;
    const bonus = parseFloat(document.getElementById('uretim-bonusu').value) / 100 || 0;
    const hamAdmin = parseFloat(document.getElementById('ham-admin').value) || 0;
    const cooBecerisi = parseFloat(document.getElementById('coo-skill').value) || 0;
    const hedefAdet = parseFloat(document.getElementById('hedef-adet').value) || 0;

    const aktifBina = BinaVerileri.enerji;

    // 2. Net Yönetim Gideri Hesabı (Harsh Etkisi)
    // SimCo algoritması: Her yönetim puanı ham admini belli bir katsayıyla düşürür.
    // %22.35'ten %14.98'e düşüş (30 puan için) baz alınmıştır.
    const indirimKatsayisi = 0.2456; 
    const netAdminOrani = Math.max(0, hamAdmin - (cooBecerisi * indirimKatsayisi));
    
    // 3. Üretim Hızı Hesabı
    // Bonus ve Seviye üretimi doğrudan artırır
    const guncelSaatlikUretim = (aktifBina.saatlikTabanUretim * lv) * (1 + bonus);
    const gerekenSure = hedefAdet / guncelSaatlikUretim;

    // 4. Maliyet Hesabı
    const birimYonetimMaliyeti = aktifBina.birimIscilik * (netAdminOrani / 100);
    const birimToplamMaliyet = aktifBina.birimIscilik + birimYonetimMaliyeti + aktifBina.hamMadde;
    const toplamKasaCikisi = birimToplamMaliyet * hedefAdet;

    // 5. Ekranı Güncelle
    document.getElementById('res-birim-maliyet').innerText = "$" + birimToplamMaliyet.toFixed(3);
    document.getElementById('res-net-admin').innerText = "%" + netAdminOrani.toFixed(2);
    document.getElementById('res-sure').innerText = formatSure(gerekenSure);
    document.getElementById('res-toplam-maliyet').innerText = "$" + toplamKasaCikisi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Saat cinsinden gelen süreyi "1g 4s" formatına çevirir
function formatSure(saat) {
    if (saat < 24) return saat.toFixed(1) + " Saat";
    const gun = Math.floor(saat / 24);
    const kalanSaat = Math.round(saat % 24);
    return gun + " Gün " + kalanSaat + " Saat";
}

// Tüm inputlara "değişiklik" dinleyicisi ekle (Anlık hesaplama için)
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', hesapla);
});

// İlk açılışta bir kez hesapla
hesapla();
