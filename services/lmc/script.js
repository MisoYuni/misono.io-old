// script.js, © Ryan Kim 2023

// Global variables
var table = {
    "ADD": "1",
    "SUB": "2",
    "STA": "3",
    "LDA": "5",
    "BRA": "6",
    "BRZ": "7",
    "BRP": "8",
    "INP": "901",
    "OUT": "902",
    "HLT": "000"
};
var cycles = 0;
var isPaused = true;
var timer;

function run()
{
    clearInterval(timer);
    cycles = 0;

    reset(false);

    var clock = parseInt(document.getElementById("clock").value);

    isPaused = false;
    timer = setInterval(runCycle, 1000/clock);
}

function step()
{
    clearInterval(timer);
    isPaused = true;
    runCycle();
}

function pause()
{
    clearInterval(timer);
    isPaused = true;
}

function load()
{

}

// Resets all registers, I/Os and memories.
function reset(memoryReset)
{
    // Resetting registers
    document.getElementById('pc').value = "000";
    document.getElementById('mar').value = "000";
    document.getElementById('mdr').value = "000";
    document.getElementById('cir').value = "000";
    document.getElementById('acc').value = "000";

    // Resetting I/Os
    document.getElementById('input').value = "";
    document.getElementById('output').value = "";
    document.getElementById('screen').innerHTML = "";
    document.getElementById('log').innerHTML = "";

    // Resetting memories
    if (memoryReset)
    {
        for (var i=0;i<100;i++)
        {
            document.getElementById('cell_'+pad(i)).value = "000";
        }
    }
}

function assemble()
{
    
}

function selectExample()
{
    var accept = confirm("This operation is going to overwrite your current program. Continue?");
    if (accept)
    {
        var temp = document.getElementById("examples").options[document.getElementById("examples").selectedIndex].value;
        document.getElementById("code").value = document.getElementById("example_"+temp).value;
        load();
    }
}

/*
log("Fetch&nbsp;&nbsp;&nbsp;| ")
log("Decode&nbsp;&nbsp;| ")
log("Execute&nbsp;| ")
*/

function runCycle()
{
    log("----------------------------------------", true);
    pc = parseInt(document.getElementById("pc").value);
    log("Fetch&nbsp;&nbsp;&nbsp;| Current PC: "+pc)

    var inst = document.getElementById("cell_"+pad(pc)).value;

    document.getElementById("mar").value = pc;
    log("Fetch&nbsp;&nbsp;&nbsp;| MAR <- PC ("+pc+")");
    pc = pc + 1;
    document.getElementById("pc").value = pc;
    log("Fetch&nbsp;&nbsp;&nbsp;| PC <- PC + 1 ("+(pc+1)+")");
    document.getElementById("mdr").value = inst;
    log("Fetch&nbsp;&nbsp;&nbsp;| MDR <- MAR ("+inst+")");
    document.getElementById("cir").value = inst;
    log("Fetch&nbsp;&nbsp;&nbsp;| CIR <- MDR ("+inst+")");

    var opcode = inst.substr(0,1);
    var operand = inst.substr(1);

    switch(opcode)
    {
        case "0":
            log("Decode&nbsp;&nbsp;| Instruction decoded: HLT");
            isPaused = true;
            cycles = 0;

            clearInterval(timer);
            log("Execute&nbsp;| stop");

            break;
        
        case "1":
            log("Decode&nbsp;&nbsp;| Instruction decoded: ADD")
            cycles = cycles + 1;

            document.getElementById("mar").value = operand;
            log("Execute&nbsp;| MAR <- CIR[operand] ("+pad(parseInt(operand))+")");
            document.getElementById("mdr").value = parseInt(document.getElementById("cell_"+pad(parseInt(operand))).value);
            log("Execute&nbsp;| MDR <- Memory["+pad(parseInt(operand))+"] ("+document.getElementById("mdr").value+")");

            document.getElementById("acc").value = parseInt(document.getElementById("acc").value) + parseInt(document.getElementById("mdr").value);
            log("Execute&nbsp;| Acc <- Acc + MDR ("+document.getElementById("acc").value+")");
            
            break;

        case "2":
            log("Decode&nbsp;&nbsp;| Instruction decoded: SUB");
            cycles = cycles + 1;

            document.getElementById("mar").value = operand;
            log("Execute&nbsp;| MAR <- CIR[operand] ("+pad(parseInt(operand))+")");
            document.getElementById("mdr").value = parseInt(document.getElementById("cell_"+pad(parseInt(operand))).value);
            log("Execute&nbsp;| MDR <- Memory["+pad(parseInt(operand))+"] ("+document.getElementById("mdr").value+")");

            document.getElementById("acc").value = parseInt(document.getElementById("acc").value) - parseInt(document.getElementById("mdr").value);
            log("Execute&nbsp;| Acc <- Acc - MDR ("+document.getElementById("acc").value+")");
            
            break;

        case "3":
            log("Decode&nbsp;&nbsp;| Instruction decoded: STA");
            cycles = cycles + 1;

            document.getElementById("mar").value = operand;
            log("Execute&nbsp;| MAR <- CIR[operand] ("+pad(parseInt(operand))+")");
            document.getElementById("mdr").value = document.getElementById("acc").value;
            log("Execute&nbsp;| MDR <- Acc ("+document.getElementById("acc").value+")");
            document.getElementById("cell_"+pad(parseInt(operand))).value = document.getElementById("mdr").value;
            log("Execute&nbsp;| Memory["+pad(parseInt(operand))+"] <- MDR ("+document.getElementById("mdr").value+")");

            break;

        case "5":
            log("Decode&nbsp;&nbsp;| Instruction decoded: LDA");
            cycles = cycles + 1;

            document.getElementById("mar").value = operand;
            log("Execute&nbsp;| MAR <- CIR[operand]");
            document.getElementById("mdr").value = document.getElementById("cell_"+pad(parseInt(operand))).value;
            log("Execute&nbsp;| MDR <- Memory["+pad(parseInt(operand))+"]");
            document.getElementById("acc").value = document.getElementById("mdr").value;
            log("Execute&nbsp;| Acc <- MDR ("+document.getElementById("mdr").value+")");

            break;

        case "6":
            log("Decode&nbsp;&nbsp;| Instruction decoded: BRA");
            cycles = cycles + 1;

            pc = parseInt(operand);
            document.getElementById("pc").value = operand;
            log("Execute&nbsp;| PC <- CIR[operand] ("+pad(parseInt(operand))+")");

            break;
        case "7":
            log("Decode&nbsp;&nbsp;| Instruction decoded: BRZ");
            cycles = cycles + 1;

            if (parseInt(document.getElementById("acc").value) == 0)
            {
                log("Execute&nbsp;| Acc == 0 (true)");
                pc = parseInt(operand);
                document.getElementById("pc").value = operand;
                log("Execute&nbsp;| PC <- CIR[operand] ("+pad(parseInt(operand))+")");
            }
            else
            {
                log("Execute&nbsp;| Acc != 0 (false)");
            }

            break;
        case "8":
            log("Decode&nbsp;&nbsp;| Instruction decoded: BRP");
            cycles = cycles + 1;
    
            if (parseInt(document.getElementById("acc").value) >= 0)
            {
                log("Execute&nbsp;| Acc >= 0 (true)");
                pc = parseInt(operand);
                document.getElementById("pc").value = operand;
                log("Execute&nbsp;| PC <- CIR[operand] ("+pad(parseInt(operand))+")");
            }
            else
            {
                log("Execute&nbsp;| Acc < 0 (false)");
            }
    
            break;
        case "9":
            if (operand == "01")
            {
                log("Decode&nbsp;&nbsp;| Instruction decoded: INP");
                cycles = cycles + 1;

                var input = prompt("Input:");
                log("Execute&nbsp;| Input <- "+input);
                document.getElementById("input").value = document.getElementById("input").value + input + "\n";
                document.getElementById("input").scrollTop = document.getElementById("input").scrollHeight;

                document.getElementById("acc").value = input;
                log("Execute&nbsp;| Acc <- Input ("+input+")");
            }
            else if (operand == "02")
            {
                log("Decode&nbsp;&nbsp;| Instruction decoded: OUT");
                cycles = cycles + 1;

                document.getElementById("output").value = document.getElementById("output").value + document.getElementById("acc").value + "\n";
                document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
                log("Execute&nbsp;| Output <- Acc ("+document.getElementById("acc").value+")");
            }
            break;
    }
}

function pad(n)
{
        return (n < 10) ? ("0" + n) : n;
}

function log(txt,reset=false) {
    if (reset)
    {
    document.getElementById("screen").innerHTML = txt.replace("   ","&nbsp;&nbsp;&nbsp;") + "<br/>";
    }
    else
    {
    document.getElementById("screen").innerHTML = document.getElementById("screen").innerHTML + txt.replace(" ","&nbsp;") + "<br/>";  
    }
    //document.getElementById("log").insertAdjacentHTML('beforeend', txt.replace(" ","&nbsp;") + "<br/>");
    var temp = document.getElementById("log").innerHTML.split('<br>')
    document.getElementById("log").innerHTML = temp.slice(Math.max(temp.length - 100, 0), temp.length).join("<br/>") + txt.replace(" ","&nbsp;") + "<br/>";
    document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
  }