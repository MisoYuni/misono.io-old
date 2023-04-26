// © 2023 Misono Network 

var txt = 'neofetch';
var speed = 80;

var ctxt = '<span id=\"cursor\">█</span>';
var cursor = true;
var cursor_speed = 600;
      
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeWriter() {
    await sleep(200)

    var i = 0;
    while (i < txt.length) {
        var temp = document.getElementById("demo").innerHTML
        document.getElementById("demo").innerHTML = temp.substring(0, temp.length - ctxt.length) + txt.charAt(i) + ctxt;
        i++;
        await sleep(speed)
    }

    await sleep(200)
    document.getElementById("art").innerHTML = document.getElementById("storage1").innerHTML

    await sleep(200)
    document.getElementById("info").innerHTML = document.getElementById("storage2").innerHTML

    setInterval(() => {
        if(cursor) {
            document.getElementById('cursor').style.opacity = 0;
            cursor = false;
        } else {
            document.getElementById('cursor').style.opacity = 1;
            cursor = true;
        }
    }, cursor_speed);
}