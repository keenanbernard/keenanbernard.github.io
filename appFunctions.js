//selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const home_btn = document.querySelector(".home button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const timer_line = document.querySelector("header .timer_line");
const timerText = document.querySelector(".timer .time_left_text");
const timerCount = document.querySelector(".timer .timer_sec");
const option_list = document.querySelector(".option_list");
const results_box = document.querySelector(".results_box");


// action if volume button is selected to adjust setting
document.querySelector(".volume_on_btn button").addEventListener('click', function() {
const vol = this.querySelector('i');

    if (vol.classList.contains('fa-volume-high')) {
        vol.classList.remove('fa-volume-high');
        vol.classList.add('fa-volume-xmark');
        document.getElementById("quiz_song").volume = 0.0;
     } else {
     vol.classList.remove('fa-volume-xmark');
        vol.classList.add('fa-volume-high');
        document.getElementById("quiz_song").volume = 0.1;
  }
});


// action if startQuiz button is clicked, add info box to the screen
start_btn.onclick = ()=>{
    info_box.classList.add("enabledInfo"); 
    document.getElementById("quiz_song").play();
}

// action if exitQuiz button is clicked, remove info box from the screen
exit_btn.onclick = ()=>{
    info_box.classList.remove("enabledInfo");
    document.getElementById("quiz_song").load();
}

// actions if continueQuiz button is clicked
continue_btn.onclick = ()=>{
    info_box.classList.remove("enabledInfo"); //remove info box
    quiz_box.classList.add("enabledQuiz"); //add quiz box
    showQuestions(0); //showQuestions function called
    queCounter(1); //passing parameter of 1 through queCounter function
    startTimer(30); //startTimer function called
    startTimerLine(0); //startTimerLine function called
}

// action if home button is clicked, return to start of quiz
home_btn.onclick = ()=>{
    window.location.reload();
}


let timeValue =  30;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = results_box.querySelector(".buttons .restart");
const quit_quiz = results_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("enabledQuiz"); 
    results_box.classList.remove("enabledResults"); 
    timeValue = 30; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuestions(que_count);
    queCounter(que_numb); //passing que_numb through queCounter function
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(timeValue); 
    startTimerLine(widthValue);
    timerText.textContent = "Time Left"; //modifying the text used for timer
    next_btn.classList.remove("show"); //hide the next button
}

// if quitQuiz button is clicked, reload the current window
quit_quiz.onclick = ()=>{
    window.location.reload();
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_questions");

// if Next Que button clicked
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){ //if question count is less than total question length
        que_count++; //increment the que_count value
        que_numb++; //increment the que_numb value
        showQuestions(que_count);
        queCounter(que_numb); //passing que_numb through queCounter function
        clearInterval(counter); 
        clearInterval(counterLine); 
        startTimer(timeValue); //startTimer function called
        startTimerLine(widthValue); //startTimerLine function called
        timerText.textContent = "Time Left";
        next_btn.classList.remove("show");
    }else{
        clearInterval(counter);
        clearInterval(counterLine);
        showResults(); //showResults function called
    }
}

// function used to retrieve questions and options from array (stored in appQuestions)
function showQuestions(index){
    const question = document.querySelector(".question");

    //div and span tags used to concat and present questions and its options by passing the value through an array index
    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    let option_tag = '<div class="option"><span>'+ questions[index].options[0] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[1] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[2] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[3] +'</span></div>';
    question.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
    
    const option = option_list.querySelectorAll(".option");

    // applying onclick attribute to all available options of current question
    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}
// div tags created to display icons on answer presentation, post option select
let correctTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let incorrectTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(answer){
    clearInterval(counter); 
    clearInterval(counterLine); 
    let userAns = answer.textContent; //retrieving user selected option
    let correcAns = questions[que_count].answer; //retrieving correct answer from question array
    const allOptions = option_list.children.length; //retrieving all option items
    
    if(userAns == correcAns){ //if user selected option is equal to array's correct answer
        userScore += 1; //upgrading score value with 1
        answer.classList.add("correct"); //applying green color to correctly selected option
        answer.insertAdjacentHTML("beforeend", correctTag); //applying tick icon to correctly selected option
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    }else{ 
        //applying red color and cross icon to correctly selected option
        answer.classList.add("incorrect"); 
        answer.insertAdjacentHTML("beforeend", incorrectTag);
        console.log("Wrong Answer");

        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){ //if there is an option which is matched to an array answer 
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", correctTag); //adding tick icon to matched option
                console.log("Auto selected correct answer.");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled"); //after choice selection, options are disabled
    }
    next_btn.classList.add("show"); //display the next button after option is selected
}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timerCount.textContent = time; //changing the value of timerCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = timerCount.textContent; 
            timerCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter);
            timerText.textContent = "Time Off";
            const allOptions = option_list.children.length;
            let correcAns = questions[que_count].answer; //getting correct answer from array
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correcAns){ 
                    option_list.children[i].setAttribute("class", "option correct"); 
                    option_list.children[i].insertAdjacentHTML("beforeend", correctTag); 
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for(i=0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show");
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 32);
    function timer(){
        time += 1; //upgrading time value with 1
        timer_line.style.width = time + "px"; //increasing width of timer_line with px by time value
        if(time > 945){ //if time value is greater than 945
            clearInterval(counterLine); //clear counterLine
        }
    }
}

function queCounter(index){
     //span tags used to concat and present current question number and total question number to user
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ questions.length +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}

function showResults(){
    info_box.classList.remove("enabledInfo"); 
    quiz_box.classList.remove("enabledQuiz"); 
    results_box.classList.add("enabledResults");
    const scoreText = results_box.querySelector(".score_text");

    let avgScore = Math.round((userScore / questions.length) * 100);

    if (avgScore > 66){ // if user scored more than 60%
        //span tags used to concat and present user score number, total question and score text to user
        let scoreTag = '<span>Your Fitness IQ Score is <p>'+ userScore+'/'+ questions.length +'</p><p>('+ avgScore +'%)</p> is above average.</span>';
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else{ // if user scored less than 66
        let scoreTag = '<span>Your Fitness IQ Score is <p>'+ userScore+'/'+ questions.length +'</p> <p>('+ avgScore +'%)</p> is below average.</span>';
        scoreText.innerHTML = scoreTag;
    }
}
