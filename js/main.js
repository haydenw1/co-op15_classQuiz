//main object for the class quiz
var quiz = {

  //An object that stores d3 'tools' that are reuseable between functions
  //(i.e d3 scales, axises, etc.)
  d3Tools : {},

  //object to hold elements
  elem: {},

  //object to hold measurements
  meas: {},



  /**
   * setUp
   *   Main function that is called from 'index.html' to create quiz elements,
   *   dynamically size elements, and bind and define event listeners.
   */
  setUp: function(){
    quiz.meas.width = document.documentElement.clientWidth;
    quiz.meas.height = document.documentElement.clientHeight;
    quiz.meas.padding = quiz.meas.width * .08;

    quiz.meas.currentQuestion = 0;
    quiz.elem.questionP = $( "#qP" );
    quiz.elem.answerPs = $(".answer p");

    quiz.setBodyPadding();
    //quiz.makeTools();
    quiz.useData();
    quiz.attachListeners();
  },



  /**
   * setBodyPadding
   *   Function that uses predetermined percentage of width padding to reset the
   *   body height and width and add padding to the body element.
   */
  setBodyPadding: function(){
    var doublePadding = quiz.meas.padding * 2;

    document.body.style.height = quiz.meas.height - ( doublePadding ) + "px";
    document.body.style.width = quiz.meas.width - ( doublePadding ) + "px";
    document.body.style.padding = quiz.meas.padding + "px";
  },



  /**
   * useData
   *   Gets the amount of questions in the data object and stores it, as well as
   *   inserting the question and answer choices from the first question into the
   *   existing DOM elements.
   */
  useData: function(){
    var data = quiz.data;
    var position = quiz.meas.currentQuestion;
    var answers = data.questions[position].answers;

    quiz.meas.questionAmount = data.questions.length - 1;

    quiz.elem.questionP.html(data.questions[position].question);

    for(var i = 0; i < answers.length; i++){
      quiz.elem.answerPs[i].innerHTML = answers[i].text;
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
      .data(quiz.data.questions[quiz.meas.currentQuestion].answers)
      .on("touchstart", function(d){
        //console.log(d.key);

        quiz.recordAnswer(d.key);
        //console.log(++quiz.data.answers[d.key]);

        if(quiz.meas.currentQuestion >= quiz.meas.questionAmount){
          quiz.showResults();
          //console.log("show results");
        }else{
          quiz.meas.currentQuestion++;
          quiz.advanceQuestion();
          //console.log("advance to question " + quiz.meas.currentQuestion);
        };
      });
  },



  /**
   * recordAnswer
   *   Called when an answer is selected to record the user's choice in the 'answers'
   *   array that is located in the main data object. 'answers' is an array of objects
   *   (to aid in d3 visualization of the data later on), so we must search through
   *   the objects in 'answers' to see if their key property matches the key of the
   *   answer selected by the user. If so, the count of the this key in the 'answers'
   *   array is incremented by one.
   *
   * @param key {string} - data value of the key associated with the user's answer
   */
  recordAnswer: function(key){
    var answers = quiz.data.answers;
    for(var i = 0; i < answers.length; i++){
      if( quiz.data.answers[i].key === key){
        quiz.data.answers[i].count++;
        return;
      }
    }
  },



  /**
   * advanceQuestion
   *  Advances the questions and answer choices when a user selects an answer and
   *  there is more questions still left in the quiz. Calls 'updateAnswerData' to
   *  keep the d3 data correct.
   */
  advanceQuestion: function(){
    var position = quiz.meas.currentQuestion;
    var answers = quiz.data.questions[position].answers;

    quiz.elem.questionP.html(quiz.data.questions[position].question);

    for(var i = 0; i < answers.length; i++){
      quiz.elem.answerPs[i].innerHTML = quiz.data.questions[position].answers[i].text;
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
   *                           on the 'currentQuestion' the user is on.
   */
  updateAnswerData: function(newData){
    //console.log("new shit" + newData);
    d3.selectAll(".answer")
      .data(newData);
  },



  /**
   * showResults
   *  Function called when the user selects an answer and there are no more questions
   *  left in the quiz. Removes answer divs and transitions into displaying the
   *  results of the quiz to the user.
   */
  showResults: function(){
    $( ".answer" ).remove();

    quiz.elem.questionP.html("Your quiz results:");

    d3.select(".question")
      //change 'question' class to 'results' class
      .attr("class", "results")
      .transition()
        .style("height", quiz.meas.height * .5 + "px");

    quiz.elem.resultsDivHeight = quiz.meas.height * .5;

    quiz.makeResultsGraph();

    console.log(quiz.data.answers);
  },



  /**
   * makeResultsGraph
   *  D3, makes a vis (maybe bar graph right now) that is simple and displays the
   *  results of the users answers based on the 'key' or category of the answers.
   */
  makeResultsGraph: function(){
    var questionPHeight = quiz.elem.questionP.outerHeight(true);
    var svgHeight = quiz.elem.resultsDivHeight - questionPHeight
    var resultsDivWidth = $( ".results" ).width();

    //varable that will hold xScale for legibility (assigned after 'makeTools()' call)
    var x;

    //varable that will hold yScale for legibility (assigned after 'makeTools()' call)
    var y;

    quiz.makeTools(resultsDivWidth, svgHeight);
    x = quiz.d3Tools.xScale;
    y = quiz.d3Tools.yScale;

    d3.select(".results")
      .append("svg")
        .attr("class", "results-svg")
        .attr("height", svgHeight)
        .attr("width", resultsDivWidth)
        .attr("transform", "translate(0," + questionPHeight + ")")
        .append("g")
          .attr("class", "results-g")
          .selectAll("rect")
          .data(quiz.data.answers)
          .enter()
          .append("rect")
            .attr("x", function(d,i){
              return x(i);
            })
            .attr("y", function(d){
              return y(d.count);
            })
            .attr("height", function(d){
              return svgHeight - y(d.count);
            })
            .attr("width", x.rangeBand());
  },



  /**
   * makeTools
   *   Function to create any d3 tools that don't to access the data yet (scales,
   *   axises, etc.)
   *
   * @param width {number} - width of svg that vis will need to be scaled to fit
   * @param height {number} - height of svg that vis will need to be scaled to fit
   */
  makeTools: function(width, height){
    quiz.d3Tools.xScale = d3.scale.ordinal()
      .domain([0, 1, 2])
      .rangeRoundBands([0, width], .2);

    quiz.d3Tools.yScale = d3.scale.linear()
      .domain([0, 5])
      .range([height, 0]);
  },



  //main data object that holds the questions for the user and the user's answers
  data: {
    answers: [
      {
        "count": 0,
        "key": "code"
      },
      {
        "count": 0,
        "key": "design"
      },
      {
        "count": 0,
        "key": "print"
      }
    ],

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
