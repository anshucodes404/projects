console.log("Let's Write Some JavaScript!");

let result;
let equalsPressed = false;  // Flag to track if equals was pressed

//Adding Event when any button is clicked
Array.from(document.getElementsByTagName("button")).forEach((button) => {
  button.addEventListener("click", (e) => {

    //Ading EventLIstener to "=" buttton
    if (e.target.innerHTML === "=") {
      document.querySelector("#eqn").style.display = "none";
      document.getElementById("result").style.fontSize = "40px";
      equalsPressed = true;  // Set the flag when equals is pressed
    }

    //Adding EventListener to "AC" button
    else if (e.target.innerHTML === "AC") {
      document.querySelector("#eqn").innerHTML = "";
      document.getElementById("result").innerHTML = "0";
      document.querySelector("#eqn").style.display = "block";
      document.getElementById("result").style.fontSize = "25px";
      equalsPressed = false;  // Reset the flag
    }
    
    else {
      if (equalsPressed) {
        // Reset everything if a new button is pressed after equals
        document.querySelector("#eqn").innerHTML = "";
        document.getElementById("result").innerHTML = "0";
        document.querySelector("#eqn").style.display = "block";
        document.getElementById("result").style.fontSize = "25px";
        equalsPressed = false;
      }
      document.querySelector("#eqn").innerHTML += e.target.innerHTML;
      result = eval(`${document.querySelector("#eqn").innerHTML}`);
    }

    //Finding result
    result = eval(`${document.querySelector("#eqn").innerHTML}`);
    //If nothing is there in eval it gives undefined so making the result = 0 when result is undefined
    if(result === undefined){
      result = "0"
    }
    document.getElementById("result").innerHTML = result;
  });
});
