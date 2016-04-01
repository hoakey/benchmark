/*************
 * Objectives:
 * Allow user input code
 * - Have example DOM objects for user code to interact
 * - Handle errors?
 * Test runs per second and tell average time
 * Test 10 runs, display time, average time
 * -Display box red/green, fastest/slowest
 * Allow user to import libraries
 */

function init() {
    var numbers = [3,4,5,6,7,8,9];
    fillOptions("numIn", numbers);
    var tags = ['div','a','address','area','article','aside','audio','bdi','bdo','blockquote','body','button','canvas','cite','code','dd','details','dfn','dialog','div','dl','dt','em','embed','fieldset','figcaption','figure','footer','form','h1','h2','h3','h4','h5','h6','head','header','hr','html','iframe','img','input','ins','kdb','keygen','label','legend','li','link','main','map','mark','menu','menuitem','meter','nav','object','ol','optgroup','option','output','p','param','pre','progress','rp','rt','samp','script','section','select','source','span','summary','table','tbody','td','textarea','th','thead','time','title','tr','track','ul','var','video','wbr'];
    fillOptions("elemType", tags);
}



function numInChange(select) {
    var area = document.getElementById("code");
    if (select.value > area.children.length) {
        while (area.children.length < select.value) {
            addInput(area);
        }
    } else {
        while (area.children.length > select.value) {
            area.removeChild(area.lastChild);
        }
    }
}

function run(type) {
    var inputs = getInput("input");
    for (var i = 0; i < inputs.libs.length; i++)
        getLib(inputs.libs[i]);

    for (var i = 0; i < inputs.code.length; i++) {
        if (type === "speed")
            runSpeed(inputs.code[i]);
        //Default to
        else
            runSecond(inputs.code[i]);
    }
}

function runSecond(input) {
    //Make sure input is not empty
    if (input.value) {
        var countTimesRun = 0;                  //Management variables
        var doneExecutingLoop = false;         //Flag to break loop
        var startLoopTime = performance.now();  //Odd variable names to not
        var checkLoopTime = 25;                 //...interfere with user input
        //This solution costs overhead but a timing event would not be seen
        //while our loop is using the one thread
        while (!doneExecutingLoop) {
            //Time to check if we should break?
            if (checkLoopTime--) {
                eval(input.value);
                countTimesRun++;
            } else {
                //Wait 1 second
                if (performance.now() - startLoopTime > 1000)
                    doneExecutingLoop = true;   //Is it time to break loop?
                else
                    checkLoopTime = 25;
            }
        }
        var average = 1000 / countTimesRun;
        display(input.parentElement, average, countTimesRun);
        //Display if input was empty
    } else
        display(input.parentElement, 0, 0);
}

function runSpeed(input) {
    var times = [];
    //Make sure input is not empty
    if (input.value) {
        //Execute input 50 times
        //Using i as index variable may cause collisions with user-input
        for (var indexOfRuns = 50; indexOfRuns; indexOfRuns--) {
            //Performance is an member of window
            var start = performance.now();
            //Separate this to avoid any clashes with input code
            if (1)
                eval(input.value);
            var end = performance.now();
            times.push(end - start);
        }
        display(input.parentElement, getAverage(times));
    } else
        display(input.parentElement, 0);
}

function getAverage(times) {
    var total = 0.0;
    //Don't count up while i < times.length, count down
    for (var i = times.length - 1; i; i--) {
        total += times[i];
    }
    return total / times.length;
}

function getInput() {
    var options = document.getElementsByName("library");
    //Get urls of checked library options
    var urls = [];
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked)
            urls.push(options[i].value);
    }
    //Build inputs array
    var inputs = {
        libs:urls,
        code:document.getElementsByClassName("input")
    };
    return inputs;
}

function getLib(src) {
    var newscript = document.createElement('script');
    newscript.type = 'text/javascript';
    newscript.async = true;
    newscript.src = src;
    //If no head exist, put the script in body
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(newscript);
}

function display(inputArea, average, count) {
    //If the node doesn't already exist, create it
    if (!inputArea.querySelector(".showAverage")) {
        var child = document.createElement("p");
        child.className = "showAverage";
        inputArea.appendChild(child);
    }
    var showAverage = inputArea.querySelector(".showAverage");
    showAverage.textContent = "Average run time in milliseconds: " + average;

    //If there is a count supplied, perform the same steps
    if (count) {
        if (!inputArea.querySelector(".showCount")) {
            var child = document.createElement("p");
            child.className = "showCount";
            inputArea.appendChild(child);
        }
        var showCount = inputArea.querySelector(".showCount");
        showCount.textContent = "Runs per Second: " + count;
    }
}

function addInput(parent) {
    var container = document.createElement("div");
    container.className = "container";
    var child = document.createElement("textarea");
    child.className = "input";
    child.rows = 15;
    child.cols = 50;
    child.placeholder="Enter code snippet here...";
    parent.appendChild(container);
    container.appendChild(child);
}

function fillOptions(selectId, options) {
    var select = document.getElementById(selectId);
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i];
        option.text = options[i];
        select.add(option);
    }
}

function addElement() {
    //Create type of element
    var child = document.createElement(document.getElementById("elemType").value);
    child.id = document.getElementById("elemId").value;
    child.className = document.getElementById("elemClass").value;
    //Make background a random dark color
    child.style.backgroundColor = "#" + Math.floor(Math.random() * (999 - 111 + 1) + 111);
    child.style.color = "OldLace";
    
    //Element describes itself to user
    var type = document.createTextNode("I am a: " + child.tagName.toLowerCase());
    var id = document.createTextNode(" Id: " + child.id);
    var className = document.createTextNode(" Class: " + child.className);
    child.appendChild(type);
    child.appendChild(id);
    child.appendChild(className);
    //Add element to page
    document.getElementById("examples").appendChild(child);
}