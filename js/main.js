//main object for the class quiz
var quiz = {


  elements: {},

  measurements: {},



  /**
   * setUp
   *   Main function that is called from 'index.html' to create quiz elements,
   *   dynamically size elements, and bind and define event listeners.
   */
  setUp: function(){
    quiz.measurements.width = document.documentElement.clientWidth;
    quiz.measurements.height = document.documentElement.clientHeight;
    quiz.measurements.padding = quiz.measurements.width * .08;

    quiz.measurements.currentQuestion = 0;
    quiz.elements.questionP = $( "#qP" );
    quiz.elements.answerPs = $(".answer p");

    quiz.setBodyPadding();
    quiz.useData();
    quiz.attachListeners();
  },



  /**
   * setBodyPadding
   *   Function that uses predetermined percentage of width padding to reset the
   *   body height and width and add padding to the body element.
   */
  setBodyPadding: function(){
    var doublePadding = quiz.measurements.padding * 2;

    document.body.style.height = quiz.measurements.height - ( doublePadding ) + "px";
    document.body.style.width = quiz.measurements.width - ( doublePadding ) + "px";
    document.body.style.padding = quiz.measurements.padding + "px";
  },



  /**
   * useData
   *   Gets the amount of questions in the data object and stores it, as well as
   *   inserting the question and answer choices from the first question into the
   *   existing DOM elements.
   */
  useData: function(){
    var data = quiz.data;
    var position = quiz.measurements.currentQuestion;
    var answers = data.questions[position].answers;

    quiz.measurements.questionAmount = data.questions.length - 1;

    quiz.elements.questionP.html(data.questions[position].question);

    for(var i = 0; i < answers.length; i++){
      quiz.elements.answerPs[i].innerHTML = answers[i].text;
    }
  },



  /**
   * attachListeners
   *   D3, binds touch event listener to answer divs. On touch, anon function checks
   *   current question position against amount of questions in data object, and
   *   either advances to next question or shows final results of quiz.
   */
  attachListeners: function(){
    d3.selectAll(".answer")
      .data(quiz.data.questions[quiz.measurements.currentQuestion].answers)
      .on("touchstart", function(d){
        //console.log(d.key);
        console.log(++quiz.data.answers[d.key]);

        if(quiz.measurements.currentQuestion >= quiz.measurements.questionAmount){
          quiz.showResults();
          //console.log("show results");
        }else{
          quiz.measurements.currentQuestion++;
          quiz.advanceQuestion();
          //console.log("advance to question " + quiz.measurements.currentQuestion);
        };
      });
  },



  /**
   * [advanceQuestion description]
   * @return {[type]} [description]
   */
  advanceQuestion: function(){
    var position = quiz.measurements.currentQuestion;
    var answers = quiz.data.questions[position].answers;

    quiz.elements.questionP.html(quiz.data.questions[position].question);

    for(var i = 0; i < answers.length; i++){
      quiz.elements.answerPs[i].innerHTML = quiz.data.questions[position].answers[i].text;
    }

    quiz.updateAnswerData(answers);
  },



  /**
   * updateAnswerData
   *   D3, updates the data set of the d3 selection so the correct 'd.key'
   *   is saved on the user's next answer choice. 'advanceQuestion()' has already
   *   changed the answer text, but we have to update the data associated with the
   *   answer divs.
   *
   * @param newData {string} - New answers array from the main data object, based
   *                           off the 'currentQuestion' the user is on.
   */
  updateAnswerData: function(newData){
    //console.log("new shit" + newData);
    d3.selectAll(".answer")
      .data(newData);
  },



  /**
   * [showResults description]
   * @return {[type]} [description]
   */
  showResults: function(){
    $( ".answer" ).remove();

    quiz.elements.questionP.html("Your quiz results:");

    d3.select(".question")
      .transition()
        .style("height", quiz.measurements.height * .4 + "px");

    quiz.makeResultsGraph();

    console.log(quiz.data.answers);
  },

  makeResultsGraph: function(){
    var questionPHeight = quiz.elements.questionP.outerHeight(true);
    console.log(questionPHeight);

  },



  //main data object that holds the questions for the user and the user's answers
  data: {
    answers: {
      "code": 0,
      "design": 0,
      "print": 0
    },

    questions: [
      {
        "question": "Test page 1 question",
        "answers": [
          {"text": "Test page 1 test answer 2", "key": "print"},
          {"text": "Test page 1 test answer 1", "key": "design"},
          {"text": "Test page 1 test answer 3", "key": "code"},
        ]
      },
      {
        "question": "Test page 2 question",
        "answers": [
          {"text": "Test page 2 test answer 1", "key": "design"},
          {"text": "Test page 2 test answer 2", "key": "print"},
          {"text": "Test page 2 test answer 3", "key": "code"},
        ]
      },
      {
        "question": "Test page 3 question",
        "answers": [
          {"text": "Test page 3 test answer 2", "key": "print"},
          {"text": "Test page 3 test answer 1", "key": "design"},
          {"text": "Test page 3 test answer 3", "key": "code"},
        ]
      },
      {
        "question": "Test page 4 question",
        "answers": [
          {"text": "Test page 4 test answer 3", "key": "code"},
          {"text": "Test page 4 test answer 1", "key": "design"},
          {"text": "Test page 4 test answer 2", "key": "print"},
        ]
      },
      {
        "question": "Test page 5 question",
        "answers": [
          {"text": "Test page 5 test answer 3", "key": "code"},
          {"text": "Test page 5 test answer 2", "key": "print"},
          {"text": "Test page 5 test answer 1", "key": "design"},
        ]
      },
    ]
  }
}
