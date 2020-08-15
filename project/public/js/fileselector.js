var mouseX = 0;
var mouseY = 0;

/**
 * 
 * @param ev event
 */
function startSelection(ev) {
    var x = ev.clientX;     // Get the horizontal coordinate
    var y = ev.clientY;     // Get the vertical coordinate
    console.log('x: ' + x + ', y: ' + y);
}