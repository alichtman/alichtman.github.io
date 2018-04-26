function open_drawer() {
    var drawer = document.getElementById("sliding-drawer");
    drawer.style.width = "600px";
    document.getElementById("closed-drawer-button").style.display = "none";
    document.getElementById("opened-drawer-button").style.display = "flex";
    document.getElementById("sliding-drawer-content").style.display = "flex";
}

function close_drawer() {
    // Should reset to defaults
    document.getElementById("sliding-drawer").style.width = "";
    document.getElementById("opened-drawer-button").style.display = "none";
    document.getElementById("sliding-drawer-content").style.display = "none";
    document.getElementById("closed-drawer-button").style.display = "flex";
}