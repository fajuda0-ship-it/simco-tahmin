am5.ready(async function() {

    // 1. CSV Verisini Çekme ve İşleme
    async function getCSVData() {
        try {
            // DOSYA ADI BURADA: Senin attığın dosya ismiyle birebir aynı yaptık
            const response = await fetch('sim-companies-income-statement.csv');
            
            if (!response.ok) {
                throw new Error("CSV dosyası bulunamadı! Lütfen dosya adının doğru olduğundan emin ol.");
            }

            const data = await response.text();
            // Satırları ayır ve boş satırları temizle
            const rows = data.split('\n').filter(row => row.trim() !== "");
            
            // İlk satır başlıktır, onu atlayıp verileri işle
            const chartData = rows.slice(1).map(row => {
                const cols = row.split(',');
                
                // NetIncome genellikle son sütundur (18. index)
                // Timestamp ise ilk sütundur (0. index)
                const timestamp = new Date(cols[0]).getTime();
                const netIncome = parseFloat(cols[18]);

                if (isNaN(timestamp) || isNaN(netIncome)) return null;

                return {
                    date: timestamp,
                    netIncome: netIncome
                };
            }).filter(item => item !== null);

            // Grafik için veriyi tarihe göre sıralayalım (Eskiden yeniye)
            return chartData.sort((a, b) => a.date - b.date);

        } catch (error) {
            console.error("Hata oluştu:", error.message);
            alert("Veri yüklenemedi: " + error.message);
            return [];
        }
    }

    const data = await getCSVData();

    if (data.length === 0) return; // Veri yoksa devam etme

    // 2. Grafik Kurulumu (amCharts 5)
    var root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true
    }));

    // İmleç
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);

    // 3. Eksenler
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
            minorGridEnabled: true,
            minGridDistance: 70
        }),
        tooltip: am5.Tooltip.new(root, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
    }));

    // 4. Veri Serisi (Sütun)
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Net Gelir",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "netIncome",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
            labelText: "[bold]{valueY}[/] $"
        })
    }));

    // Dinamik Renklendirme: Kar (Yeşil), Zarar (Kırmızı)
    series.columns.template.adapters.add("fill", function(fill, target) {
        if (target.dataItem && target.dataItem.get("valueY") < 0) {
            return am5.color(0xff5252); 
        } else {
            return am5.color(0x69f0ae);
        }
    });

    series.data.setAll(data);

    // Başlangıç animasyonları
    series.appear(1000);
    chart.appear(1000, 100);

});
