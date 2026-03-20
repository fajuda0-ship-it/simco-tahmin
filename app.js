am5.ready(function() {

    var root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    // GRAFİK VERİSİ (Burayı istediğin gibi elinle güncelleyebilirsin)
    var data = [
        { gun: "2 Mart", deger: 122 },
        { gun: "3 Mart", deger: 371 },
        { gun: "4 Mart", deger: 450 } // Örnek ekleme
    ];

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX"
    }));

    // X Ekseni (Yatay - Günler)
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "gun",
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.data.setAll(data);

    // Y Ekseni (Düşey - Değerler)
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
    }));

    // Çizgi Serisi (Artışı göstermek için en iyisi çizgidir)
    var series = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Değer",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "deger",
        categoryXField: "gun",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
        })
    }));

    // Çizginin üzerine noktalar ekleyelim
    series.bullets.push(function() {
        return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
                radius: 5,
                fill: series.get("fill")
            })
        });
    });

    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);

});
