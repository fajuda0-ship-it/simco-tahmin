function calculateProduction() {
    const cooSkill = parseFloat(document.getElementById('coo-skill').value) || 0;
    const rawAdmin = parseFloat(document.getElementById('raw-admin').value) || 0;
    const labor = parseFloat(document.getElementById('labor-cost').value) || 0;
    const inputs = parseFloat(document.getElementById('input-cost').value) || 0;

    // COO Etkisi: Her beceri puanı yönetim giderini yaklaşık %1 (göreceli) düşürür
    // Oyun içi tam formül değişkendir ama temel mantık:
    const adminReduction = cooSkill * 0.15; // Örnek katsayı
    const netAdmin = Math.max(0, rawAdmin - adminReduction);

    // Gerçek Maliyet Hesaplama
    const totalLaborWithAdmin = labor + (labor * (netAdmin / 100));
    const finalUnitCost = inputs + totalLaborWithAdmin;

    // Ekrana Yazdır
    document.getElementById('final-cost').innerText = "$" + finalUnitCost.toFixed(2);
    document.getElementById('admin-saving').innerText = `COO ile Net Yönetim Gideri: %${netAdmin.toFixed(2)}`;
}

// Tüm inputlara dinleyici ekle
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateProduction);
});
