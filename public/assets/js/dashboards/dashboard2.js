document.addEventListener("DOMContentLoaded", function () {
    // =====================================
    // Revenue Updates
    // =====================================
    var options = {
        series: [
            {
                name: "Footware",
                data: [1.5, 2.7, 2.2, 3.6, 1.5],
            },
            {
                name: "Fashionware",
                data: [-2.8, -1.1, -2.5, -1.5, -1.2],
            },
        ],
        chart: {
            toolbar: {
                show: false,
            },
            type: "bar",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
            height: 265,
            stacked: true,
            offsetX: -20
        },
        colors: ["var(--color-primary)", "var(--color-secondary)"],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: "70%",
                columnWidth: "20%",
                borderRadius: [5],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all'
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            show: false,
        },
        yaxis: {
            min: -4,
            max: 4,
            tickAmount: 4,
        },
        xaxis: {
            categories: [
                "Jan",
                "Fab",
                "Mar",
                "Apr",
                "May",
            ],
            show: false,
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            }
        },
        tooltip: {
            theme: "dark",
        },
    };

    var chart = new ApexCharts(document.querySelector("#revenue-chart"), options);
    chart.render();




    // =====================================
    // Revenue Updates
    // =====================================
    var options = {
        color: "#adb5bd",
        series: [55, 55, 55],
        labels: ["Expance", "Revenue", "Profit"],
        chart: {
            type: "donut",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '88%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            offsetY: 7,
                        },
                        value: {
                            show: false,
                        },
                        total: {
                            show: true,
                            color: '#7C8FAC',
                            fontSize: '20px',
                            fontWeight: "600",
                            label: '$500,458',
                        },
                    },
                },
            },
        },
        stroke: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
        },
        colors: ["var(--color-primary)", "#EAEFF4", "var(--color-secondary)"],
        tooltip: {
            theme: "dark",
            fillSeriesColor: false,
        },
    };

    var chart = new ApexCharts(document.querySelector("#sales-overview"), options);
    chart.render();



    // =====================================
    // monthly-earning
    // =====================================
    var options = {
        chart: {
            id: "monthly-earning",
            type: "area",
            height: 56,
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
            fontFamily: "inherit",
            foreColor: "#adb0bb",

        },
        series: [
            {
                name: 'monthly earnings',
                color: "var(--color-primary)",
                data: [25, 66, 20, 40, 12, 58, 20],
            },
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0,
                inverseColors: false,
                opacityFrom: 0.10,
                opacityTo: 0,
                stops: [20, 180],
            },
        },


        markers: {
            size: 0,
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: true,
                position: "right",
            },
            x: {
                show: false,
            },
        },
    };
    new ApexCharts(document.querySelector("#monthly-earning"), options).render();


    // =====================================
    // weekly-stats
    // =====================================
    var options = {
        chart: {
            id: "weekly-stats2",
            type: "area",
            height: 120,
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        series: [
            {
                name: "Weekly Stats",
                color: "var(--color-primary)",
                data: [5, 15, 5, 10, 5],
            },
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0,
                inverseColors: false,
                opacityFrom: 0.1,
                opacityTo: 0,
                stops: [20, 180],
            },
        },

        markers: {
            size: 0,
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: true,
                position: "right",
            },
            x: {
                show: false,
            },
        },
    };
    new ApexCharts(document.querySelector("#weekly-stats"), options).render();



    // =====================================
    // Salary
    // =====================================
    var options = {
        series: [
            {
                name: "Yearly Sales",
                data: [20, 15, 30, 25, 10, 15, 20],
            },
        ],

        chart: {
            toolbar: {
                show: false,
            },
            offsetX: -30,
            height: 265,
            type: "bar",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        colors: [
            "var(--color-lightprimary)",
            "var(--color-lightprimary)",
            "var(--color-primary)",
            "var(--color-lightprimary)",
            "var(--color-lightprimary)",
            "var(--color-lightprimary)",
            "var(--color-lightprimary)",
        ],
        plotOptions: {
            bar: {
                borderRadius: 5,
                columnWidth: "55%",
                distributed: true,
                endingShape: "rounded",
            },
        },

        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            yaxis: {
                lines: {
                    show: false,
                },
            },
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        xaxis: {
            categories: [["Apr"], ["May"], ["June"], ["July"], ["Aug"], ["Sept"], ["Oct"]],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        tooltip: {
            theme: "dark",
        },
    };

    var chart = new ApexCharts(document.querySelector("#salary"), options);
    chart.render();



    // =====================================
    // table-chart
    // =====================================
    var options = {
        chart: {
            id: "table-chart",
            type: "area",
            width: 76,
            height: 18,
            sparkline: {
                enabled: true,
            },
            group: "table-chart",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        series: [
            {
                color: "#DFE5EF",
                data: [25, 66, 20, 40, 12, 58, 20],
            },
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            colors: ["#f3feff"],
            type: "solid",
            opacity: 0.05,
        },

        markers: {
            size: 0,
        },
        tooltip: {
            enabled: false,
        },
    };
    new ApexCharts(document.querySelector("#table-chart"), options).render();



    // =====================================
    // table-chart
    // =====================================
    var options = {
        chart: {
            id: "table-chart-1",
            type: "area",
            width: 76,
            height: 18,
            sparkline: {
                enabled: true,
            },
            group: "table-chart-1",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        series: [
            {
                color: "var(--color-primary)",
                data: [25, 66, 20, 40, 12, 58, 20],
            },
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0,
                inverseColors: false,
                opacityFrom: 0.12,
                opacityTo: 0,
                stops: [20, 180],
            },
        },


        markers: {
            size: 0,
        },
        tooltip: {
            enabled: false,
        },
    };
    new ApexCharts(document.querySelector("#table-chart-1"), options).render();



    // =====================================
    // table-chart
    // =====================================
    var options = {
        chart: {
            id: "#table-chart-2",
            type: "area",
            width: 76,
            height: 18,
            sparkline: {
                enabled: true,
            },
            group: "#table-chart-2",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        series: [
            {
                color: "#DFE5EF",
                data: [25, 66, 20, 40, 12, 58, 20],
            },
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            colors: ["#f3feff"],
            type: "solid",
            opacity: 0.05,
        },

        markers: {
            size: 0,
        },
        tooltip: {
            enabled: false,
        },
    };
    new ApexCharts(document.querySelector("#table-chart-2"), options).render();




    // =====================================
    // table-chart
    // =====================================
    var options = {
        chart: {
            id: "table-chart-3",
            type: "area",
            width: 76,
            height: 18,
            sparkline: {
                enabled: true,
            },
            group: "table-chart-3",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        series: [
            {
                color: "var(--color-primary)",
                data: [25, 66, 20, 40, 12, 58, 20],
            },
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0,
                inverseColors: false,
                opacityFrom: 0.12,
                opacityTo: 0,
                stops: [20, 180],
            },
        },


        markers: {
            size: 0,
        },
        tooltip: {
            enabled: false,
        },
    };
    new ApexCharts(document.querySelector("#table-chart-3"), options).render();


    // =====================================
    // expense
    // =====================================
    var expense = {
        series: [60, 25, 15],
        labels: ["", "", ""],
        chart: {
            height: 110,
            type: "donut",
            fontFamily: "inherit",
            foreColor: "#c6d1e9",
        },

        tooltip: {
            theme: "dark",
            fillSeriesColor: false,
        },

        colors: ["var(--color-primary)", "var(--color-secondary)", "var(--color-warning)"],
        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
        },

        stroke: {
            show: false,
        },

        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                    background: "none",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: "18px",
                            color: undefined,
                            offsetY: -10,
                        },
                        value: {
                            show: false,
                            color: "#98aab4",
                        },
                    },
                },
            },
        },
    };

    var chart = new ApexCharts(document.querySelector("#expense"), expense);
    chart.render();




    // =====================================
    // Sales
    // =====================================
    var options = {
        series: [
            {
                name: "",
                data: [25, 35, 20, 25, 40, 25],
            },
            {
                name: "",
                data: [35, 40, 20, 35, 40, 35],
            },
            {
                name: "",
                data: [40, 25, 60, 40, 20, 40],
            },
        ],
        chart: {
            type: 'bar',
            height: 85,
            width: '100%',
            stacked: true,
            stackType: '100%',
            fontFamily: "inherit",
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: true
            },
            
        },
        colors: ["var(--color-primary)", "var(--color-secondary)", "var(--color-lightinfo)"],
        grid: {
            show: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: [3],
                borderRadiusApplication: 'around',
                borderRadiusWhenStacked: 'around',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: false,
            width: 1,
            colors: ['rgba(0,0,0,0.01)']
        },
        xaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        axisBorder: {
            show: false
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            }
        },
    };

    var chart = new ApexCharts(document.querySelector("#sales"), options);
    chart.render();



    // =====================================
    // Sales two
    // =====================================
    var options = {
        series: [
            {
                name: "",
                data: [100, 60, 35, 90, 35, 100]
            },
        ],
        chart: {
            type: 'bar',
            height: 25,
            width: 100,
            fontFamily: "inherit",
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: true
            },
            width: "100%",
            offsetX: -24

        },
        colors: ["var(--color-primary)"],
        grid: {
            show: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '100%',
                borderRadius: 4,
                distributed: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 5,
            colors: ['rgba(0,0,0,0.01)']
        },
        xaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        axisBorder: {
            show: false
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            }
        },
    };

    var chart = new ApexCharts(document.querySelector("#sales-two"), options);
    chart.render();



    // =====================================
    // growth
    // =====================================
    var options = {
        chart: {
            id: "growth",
            type: "area",
            height: 25,
            sparkline: {
                enabled: true,
            },
            group: "growth",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        series: [
            {
                colors: ["var(--color-primary)"],
                data: [0, 10, 10, 10, 35, 45, 30, 30, 30, 50, 52, 30, 25, 45, 50, 80, 60, 65]
            },
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            colors: ["#f3feff"],
            type: "solid",
            opacity: 0,
        },

        markers: {
            size: 0,
        },
        tooltip: {
            enabled: false,
        },
    };
    new ApexCharts(document.querySelector("#growth"), options).render();

    // Toaster Js    
    setTimeout(() => {
        if (document.getElementById('dismiss-toast')) {
            document.getElementById('dismiss-toast').classList.add('hs-removing');
            document.getElementById('dismiss-toast').classList.remove('show-toast');
            setTimeout(() => {
                document.getElementById('dismiss-toast').remove();
            }, 300);
        }
        else { }
    }, 5000)

    setTimeout(() => {
        document.getElementById('dismiss-toast').classList.add('show-toast');
    }, 1000)

});
