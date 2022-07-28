const _question = document.getElementById('question');
const _options = document.querySelector('.options');
const _playAgainBtn = document.getElementById('again');
const _result = document.getElementById('result');
const _gameover = document.getElementById('gameover');
const _correctScore = document.getElementById('correct');
const _totalQuestion = document.getElementById('total');
const _innerContainer = document.querySelector('.inner-container');
let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

//load question from API
async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}
//event listeners
function eventListeners(){
    _playAgainBtn.addEventListener('click', restartQuiz);
}
document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});
//display question and options
function showQuestion(data){
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
        
    _question.innerHTML = `${data.question} <br>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}
//options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
            checkAnswer()
        });
    });
}
// answer checking
function checkAnswer(){    
    let selectedAnswer = _options.querySelector('.selected span').textContent;
    if(selectedAnswer == HTMLDecode(correctAnswer)){
        correctScore++;
        _result.innerHTML = `<p>Correct Answer!</p>`;
    } else {
        _result.innerHTML = `<p>Incorrect Answer!</p>`;
    }
    checkCount();   
}
// to convert html
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 4000);
        _gameover.innerHTML += `<p>Congratulations, you answered ${correctScore} question correctly</p>`;
        _playAgainBtn.style.display = "block";
        _innerContainer.style.display = "none";
        
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 400);
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _gameover.style.display = "none";
    _innerContainer.style.display = "block";
    setCount();
    loadQuestion();
}