'use strict';

let score = null;
let questionNumber = 0;
const questionSet = [
    {type: 'start-screen', available: false, text: 'Do you know your ropes? Test your knowledge!', answers: ['Start Quiz']}, 
    {type: 'question', id: 1, available: true, correctAnswer: 2, text:'The SERENE acronym for building anchors stands for:' , answers: ['Solid, Even, REinforced, Neat, Elevated', 'Solid, Equalized, REdundant, Non-Extending', 'Separated, Elevated, REactive, NEver open', 'Sequential, Equalized, REinforced, Non-Extending'], feedbackIfFalse: 'Incorrect, the correct answer is Solid, Equalized, REdundant, Non-Extending'}, 
    {type: 'question', id: 2, available: true, correctAnswer: 2, text:'The standard tie-in knot is:' , answers: ['Bowline', 'Figure 8 Follow-Through', 'Alpine Butterfly', 'Gri Gri'], feedbackIfFalse: 'Incorrect, the correct answer is Figure 8 follow-through'}, 
    {type: 'question', id: 3, available: true, correctAnswer: 1, text:'The Munter Hitch is useful for:' , answers: ['Belaying or lowering', 'Anchoring to a tree', 'Ascending a rope', 'Tying in'], feedbackIfFalse: 'Incorrect, the correct answer is Belaying or lowering'},
    {type: 'question', id: 4, available: true, correctAnswer: 4, text:'Which of the following knots is not considered a friction hitch:' , answers: ['Autoblock', 'Prusik', 'Klemheist', 'Clove hitch'], feedbackIfFalse: 'Incorrect, the correct answer is Clove hitch'},
    {type: 'question', id: 5, available: true, correctAnswer: 2, text:'The preferred hitch for attaching a climber to an anchor is:' , answers: ['Munter Hitch', 'Clove Hitch', 'Trucker\'s Hitch', 'Anchor Hitch'], feedbackIfFalse: 'Incorrect, the correct answer is Clove hitch'},
    {type: 'question', id: 6, available: true, correctAnswer: 4, text:'HMS, as in HMS Carabiner, stands for:' , answers: ['High Mileage Screw-on', 'Hexcentric Multi-Solid', 'Health Management Systems', 'Halbmastwurfsicherung'], feedbackIfFalse: 'Incorrect, the correct answer is Halbmastwurfsicherung'},
    {type: 'question', id: 7, available: true, correctAnswer: 4, text:'The EDK, or European Death Knot is also known as:' , answers: ['Alpine Butterfly', 'Bunny Ears', 'Double Fisherman\'s Bend', 'Flat Overhand'], feedbackIfFalse: 'Incorrect, the correct answer is Flat overhand'},
    {type: 'question', id: 8, available: true, correctAnswer: 1, text:'In a safe climbing system, \"opposite and opposed\" refers to the positioning of:' , answers: ['The rope-end carabiners', 'All carabiners in the system', 'The rope through the belay device', 'The bolt-end carabiners'], feedbackIfFalse: 'Incorrect, the correct answer is The rope-end carabiners'}
    ];
let currentQuestion = questionSet[0];
let correctAnswers = 0;
const totalQuestions = 8;


function clearQuestionPane(){
    //clears the question pane of content (called by render functions)
    $('#question-text').text('');
    $('#answers').text('');
    $('#question-pane').removeClass('correct');
    $('#question-pane').removeClass('incorrect');
}
function renderQuestionNumber() {
    // accesses the questionNumber global variable and renders the number in the header of the page
    $('#question-number').animate({'opacity': 0}, 200, function () {
        $(this).text(`${questionNumber} / ${totalQuestions}`);
    }).animate({'opacity': 1}, 400);
}
function renderScore() {
    // accesses the score global variable and renders the score in the header of the page
    if (score != null){
        $('#score').animate({'opacity': 0}, 200, function () {
            $(this).text(`${score}%`);
        }).animate({'opacity': 1}, 400);
    }
    else{
        $('#score').animate({'opacity': 0}, 200, function () {
            $(this).text(`---`);
        }).animate({'opacity': 1}, 400);
    }
}
function renderQuestion(){
    //takes the state of the currentQuestion to render the question pane
    let questionText = currentQuestion.text;
    let buttons = currentQuestion.answers;
    clearQuestionPane();
    $('#question-text').text(questionText);
    for (let i = 0; i < buttons.length; i++){
        if (currentQuestion.type === 'start-screen'){
            $('#answers').append(`
                <li><button class='nextButton'>${buttons[i]}</button></li>
            `);
        }
        else{
            $('#answers').append(`
                <li><button class='answer' id='pos${i}'>${buttons[i]}</button></li>
            `);
        }
        
    }
}
function setQuestionNumber(newNumber) {
    //updates the question number and calls renderQuestionNumber
    questionNumber = newNumber;
    renderQuestionNumber();
}
function calculateScore(){
    //calculates the percentage of correct answers as a fraction and returns the new score must be called after incrementing the question number
    return (correctAnswers / questionNumber);
}
function updateScore(){
    //updates the score and calls renderScore
    score = Math.floor(calculateScore() * 100);
    renderScore();
}
function generateAnswerFeedback(){
    //when an answer is selected, passes the feedback message to renderAnswerFeedback. if the answer is correct, increments the correctAnswers variable. 
    $('#answers').on('click', '.answer', function(e) {
        console.log('generateAnswerFeedback called');
        //questionNumber++;
        if (checkAnswer(this)){
            renderAnswerFeedback('Correct!');
            correctAnswers++;
            $('#question-pane').addClass('correct');
        }
        else{
            renderAnswerFeedback(currentQuestion.feedbackIfFalse);
            $('#question-pane').addClass('incorrect');
        }
        updateScore();
    });
}
function checkAnswer(answerObject){
    //is passed an answer button jquery object, returns true if it is correct and false if not
    return answerObject.id === `pos${currentQuestion.correctAnswer-1}`;
}
function renderAnswerFeedback(feedbackText){
    //renders feeback on the question pane. If feedback is for final question, then it loads with a 'see score' button rather than 'next question'.
    clearQuestionPane();
    $('#question-text').text(feedbackText);
    if (questionNumber < totalQuestions){
        $('#answers').append(`
            <li><button class='nextButton'>Next Question</button></li>
        `);
    }
    else{
        $('#answers').append(`
            <li><button class='seeScore'>See Score</button></li>
        `);
    }
}
function generateNextQuestion(){
    //randomly selects an available question and generates it.
    //calls popUsedQuestion
    setQuestionNumber(questionNumber+1);
    //creates an array of available questions
    let availableQuestions = [];
    for (let i = 0; i < questionSet.length; i++){
        if (questionSet[i].available){
            availableQuestions.push(questionSet[i]);
        };
    }
    //randomlySelects a question from the array and makes it the currentQuestion
    currentQuestion = availableQuestions[Math.floor(Math.random()*availableQuestions.length)];
    renderQuestion();
}
function nextQuestionListener(){
    //listens for a next button press, makes the current question no longer available, calls generateNextQuestion
    $('#answers').on('click', '.nextButton', function(e) {
        currentQuestion.available = false;
        generateNextQuestion();
    });
}
function renderScorePage(){
    $('#answers').on('click', '.seeScore', function(e){
        clearQuestionPane();
        if (score === 100){
            $('#question-text').text(`${score}% Great job, you got a perfect score! Would you like to try again?`);
        }
        else if (score >= 50){
            $('#question-text').text(`${score}% Not too shabby! Would you like to try again?`);
        }
        else{
            $('#question-text').text(`${score}% Better luck next time! Would you like to try again?`);
        }
        $('#answers').append(`
            <li><button class='reset'>Try Again</button></li>
        `);
    });
}
function resetQuiz(){
    //resets all variables and begins a new quiz
    $('#answers').on('click', '.reset', function(e) {
        e.preventDefault();
        questionNumber = 0;
        score = null;
        currentQuestion = null;
        correctAnswers = 0;
        renderScore();
        //sets all questions to available (except for the start-screen)
        for (let i = 1; i < questionSet.length; i++){
            questionSet[i].available = true;
        }
        generateNextQuestion();
    });
}

function handleClimbingQuiz() {
    renderQuestionNumber();
    renderScore();
    renderQuestion();
    nextQuestionListener();
    generateAnswerFeedback();
    renderScorePage();
    resetQuiz();
};

$(handleClimbingQuiz);