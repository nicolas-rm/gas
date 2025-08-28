document.addEventListener("DOMContentLoaded", function () {
    var investments = {
        series: [


            {
                name: "BTC",
                data: [500, 300, 200, 400, 600, 400, 200, 100, 500, 400, 300],
            },
            {
                name: "BTC",
                data: [250, 450, 400, 300, 250, 350, 400, 300, 200, 100, 200],
            },
        ],
        chart: {
            fontFamily: "inherit",
            foreColor: "#adb0bb",
            height: 320,
            offsetX: -18,
            type: "line",
            toolbar: {
                show: false,
            },
        },
        legend: {
            show: false,
        },
        stroke: {
            width: 3,
            curve: "smooth",
        },
        grid: {
            borderColor: "transparent",

        },
        colors: ["var(--color-primary)", "var(--color-secondary)"],
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                gradientToColors: ["#6993ff"],
                shadeIntensity: 1,
                type: "horizontal",
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
            },
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'category',
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov"
            ],
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            }
        },
        tooltip: {
            theme: "dark",
        },
    };
    new ApexCharts(document.querySelector("#investments"), investments).render();


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
