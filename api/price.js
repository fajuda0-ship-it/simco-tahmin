am5.ready(async function() {

    // 1. CSV Verisini Çekme ve İşleme
    async function getCSVData() {
        const response = await fetch('data.csv'); // Dosya adının data.csv olduğundan emin ol
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Başlığı atla

        return rows.map(row => {
            const cols = row.split(',');
            if (cols.length < 19) return null; // Eksik satırları atla
            
            return {
                date: new Date(cols[0]).getTime(), // Timestamp'i milisaniyeye çevirir
                netIncome: parseFloat(cols[18])   // NetIncome sütunu (son sütun)
            };
        }).filter(item => item !== null);
    }

    const chartData = await getCSVData();

    // 2. Grafik Kurulumu
    var root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true
    }));

    // İmleç (Cursor) ekleme
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);

    // 3. Eksenler
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
            minorGridEnabled: true
        }),
        tooltip: am5.Tooltip.new(root, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
    }));

    // 4. Veri Serisi (Sütun Grafiği)
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

    // Gelir durumuna göre renk değiştirme (Kâr: Yeşil, Zarar: Kırmızı)
    series.columns.template.adapters.add("fill", function(fill, target) {
        if (target.dataItem && target.dataItem.get("valueY") < 0) {
            return am5.color(0xff5252); // Kırmızı
        } else {
            return am5.color(0x69f0ae); // Yeşil
        }
    });

    series.data.setAll(chartData);

    // Animasyonlar
    series.appear(1000);
    chart.appear(1000, 100);

});
