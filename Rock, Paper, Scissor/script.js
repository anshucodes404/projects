console.log("Let's write the logic");
let yourChoice = null;
let compChoice = null;
let yourScore = 0
let compScore = 0
let yourScoreCard = document.querySelector(".Yscore")
let compScoreCard = document.querySelector(".Cscore")
let choices = document.querySelectorAll(".choice");
let msg = document.querySelector(".message")
let youChoose = document.querySelector(".youChoice")
let compChoose = document.querySelector(".compChoice")
console.log(choices);

//Random number generation
const randChoice = () => {
    let options = ["ROCK", "PAPER", "SCISSOR"]
    let randnum = Math.floor(Math.random() * 3)
    return options[randnum]
}

//Can also use a flag here to track User win or not
const findWinner = (yourChoice,compChoice) =>{
    if(yourChoice === compChoice){
       msg.innerHTML = "DRAW"
       msg.style.backgroundColor = "yellow"
       msg.style.color = "black"
    }
    else{
        msg.style.color = "white"
        if(yourChoice === "ROCK")
        {
            compChoice === "PAPER" ? (msg.innerHTML = "You Lose", msg.style.backgroundColor = "red", compScore++) : (msg.innerHTML = "You Won", msg.style.backgroundColor = "green", yourScore++)
        }
        else if(yourChoice === "PAPER")
        {
            compChoice === "SCISSOR" ? (msg.innerHTML = "You Lose", msg.style.backgroundColor = "red", compScore++) : (msg.innerHTML = "You Won", msg.style.backgroundColor = "green", yourScore++) 
        }
        else
        {
            compChoice === "ROCK" ? (msg.innerHTML = "You Lose", msg.style.backgroundColor = "red", compScore++) : (msg.innerHTML = "You Won", msg.style.backgroundColor = "green", yourScore++)
        }
    }
}

//Play game main function
const playGame = (yourChoice) => {
     let compChoice = randChoice()
     youChoose.innerHTML = yourChoice
     compChoose.innerHTML = compChoice
     findWinner(yourChoice, compChoice)
     yourScoreCard.innerHTML = yourScore
     compScoreCard.innerHTML = compScore
};

choices.forEach((choice) => {
  choice.addEventListener("click", (event) => {
    yourChoice = event.currentTarget.innerText;
    playGame(yourChoice);
  });
});

//Create a reset button
document.querySelector(".refresh").addEventListener("click", (e) => {
    yourScoreCard.innerHTML = 0
    yourScore = 0
    compScore = 0
    compScoreCard.innerHTML = 0
    msg.innerHTML = "START"
    msg.style.backgroundColor = "blue"
})

const images = document.querySelectorAll(".images");

images.forEach((img) => {
    img.addEventListener("mouseenter", () => {
        img.classList.add("transformed"); // Add the class to the hovered image
    });

    img.addEventListener("mouseleave", () => {
        img.classList.remove("transformed"); // Remove the class when hover ends
    });
});