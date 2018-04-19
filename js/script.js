function open_drawer() {
    console.log("open_drawer() called.");
    var drawer = document.getElementById("sliding-drawer");
    drawer.style.marginRight = "475px";
    drawer.style.width = "500px";
    drawer.style.top = "0";
    drawer.style.right = "0";

    var button = document.getElementById("drawer-button");
    button.style.marginRight = "475px";
    button.style.boxShadow = "10px 0 40px 1px rgba(0, 0, 0, 0.4)";

//    Switch images after translation of -180 degrees
//    Gonna need to mess with the margins of the button too

}

function close_drawer() {
    /**
     * Reset all css properties back to normal for the button, drawer, arrows. Nice transition back to left arrows.
     */
    console.log("close_drawer() called.");

    // Should reset to defaults
    document.getElementById("sliding-drawer").style.color = "";
    document.getElementById("drawer-button").style.color = "";

//NEEDS TO BE CONFIGURED TO DO THIS
//    #about-circle-button {
//     width: 50px;
//     height: 50px;
//     border-radius: 25px;
//     background: white;
//     float: right;
//     margin-right: 70px;
//     display: flex;
//     text-align: center;
//     overflow: hidden;
//     margin-top: 60px;
// }
//
// #about-circle-button .about-arrows {
//     width: 50%;
//     display: flex;
//     margin-left: 14px;
//     align-items: center;
//     justify-content: center;
//     background-color: white;
// }
}