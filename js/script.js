function open_drawer() {
    console.log("open_drawer() called.");
    var drawer = document.getElementById("sliding-drawer").style.marginRight = 475px;
}

function close_drawer() {
    console.log("close_drawer() called.");
    var drawer = document.getElementById("sliding-drawer");
    drawer.style.color = "transparent";
    // Should reset to defaults
    drawer.style.color=""

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