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
    $( document ).ready(function(){
      quiz.meas.width = document.documentElement.clientWidth;
      quiz.meas.height = document.documentElement.clientHeight;
      quiz.meas.padding = quiz.meas.width * .08;

      quiz.meas.currentQuestion = 0;
      quiz.elem.questionP = $( "#qP" );
      quiz.elem.answerPs = $( ".answer p" );
      quiz.elem.userTitle = $( ".title" );
      quiz.elem.titleDesc = $( ".title-description" );

      quiz.setBodyPadding();
      //quiz.makeTools();
      quiz.useData();
      quiz.attachListeners();
    });


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

    quiz.elem.questionP.html("Based on your answers we find you are a");
    quiz.meas.qDivStart = $( ".question" ).height();

    d3.select(".question")
      //change 'question' class to 'results' class
      .attr("class", "results")
      .transition()
        .style("height", 30+"px");

    quiz.elem.userTitle.html("Media Strategist");
    quiz.elem.titleDesc.html("Students who fit into the media strategist category usually excel in business and management, as well as overall knowledge of media industries where a management level approach is needed.");

    quiz.meas.resultsDivHeight = quiz.meas.height * .4;

    //console.log(JSON.stringify(quiz.data.answers, null, '\t'));
    //quiz.parseResults();
    //console.log(JSON.stringify(quiz.data.answers, null, '\t'));

    quiz.parseResults();
    //quiz.sortClasses();
    quiz.addClasses();



  },



  parseResults: function(){
    var answers = quiz.data.answers;
    var classes = quiz.classes;

    //console.log(JSON.stringify(answers, null, '\t'));
    quiz.bubbleSort(answers, "count");
    //console.log(JSON.stringify(answers, null, '\t'));

    for( var i = 0; i < answers.length; i++ ){
      answers[i].val = (i + 1);
    }

    for( var a = 0; a < classes.length; a++ ){
      classes[a].userWeight = quiz.setUserWeight(classes[a]);
    }

    quiz.bubbleSort(classes, "userWeight");

    classes.reverse();
    quiz.classes = classes.splice(0, 5);
    console.log("coleslaw");
  },



  setUserWeight: function(classObj){
    var codeVal;
    var designVal;
    var mgmtVal;
    var printVal;

    for ( i = 0; i < quiz.data.answers.length; i++ ){
      temp = quiz.data.answers[i];

      if ( temp.key == "code" ){
        codeVal = temp.val;
      }else if ( temp.key == "design" ){
        designVal = temp.val;
      }else if ( temp.key == "mgmt" ){
        mgmtVal = temp.val;
      }else{
        printVal = temp.val;
      }
    }

    return ( +(( classObj.weights.code * codeVal ) + ( classObj.weights.design * designVal ) + ( classObj.weights.mgmt * mgmtVal ) + ( classObj.weights.print * printVal )).toFixed(2) );
  },


  addClasses: function(){
    $( "body" ).append( "<div class='classes'></div>" );
    $( ".classes" ).append( "<p class='cP'>Based on your quiz results we would like to recommend the following electives:</p>");



    var textDiv = d3.select(".classes")
      .selectAll("div")
      .data(quiz.classes)
      .enter()
      .append("div")
        .attr("class", "class")
        .style("left", "calc(100% + " + (quiz.meas.padding + 1) + "px)") //plus one is quick fix for parent border...take out later

    textDiv.append("text")
      .text(function(d){
        return d.title;
      })

    textDiv.append("text")
      .text(function(d){
        return "MAAT-" + d.courseno;
      })

    textDiv.transition("ease")
      .duration(750)
      .delay(function(d, i){ return (i - 1) * 150;})
      .style("left", "0%");
  },


/*
  sortClasses: function(){//dont know if needs to be seperate
    //console.log(JSON.stringify(quiz.classes, null, '\t'));

    for(var i = 0; i < quiz.classes.length; i++){
      //console.log("SORT");
      //console.log(JSON.stringify(quiz.classes, null, '\t'));
      quiz.compare(quiz.classes, i, "weights", quiz.data.answers[0].key);
    }

    //console.log(JSON.stringify(quiz.classes, null, '\t'));
  },

*/


  bubbleSort: function(arr, prop){
      console.log(arr);
      console.log(prop);
      console.log(arr[0][prop]);
      var swapped;
      do {
          swapped = false;
          for ( var i = 0; i < arr.length - 1; i++ ) {
              if ( arr[i][prop] > arr[i+1][prop] ) {
                  var temp = arr[i];

                  arr[i] = arr[i+1];
                  arr[i+1] = temp;
                  swapped = true;
              }
          }
      } while (swapped);
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
        "key": "mgmt"
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
          {
            "text": "Test page 1 test answer 2",
            "key": "print"
          },
          {
            "text": "Test page 1 test answer 1",
            "key": "design"
          },
          {
            "text": "Test page 1 test answer 3",
            "key": "code"
          }
        ]
      },
      {
        "question": "Test page 2 question",
        "answers": [
          {
            "text": "Test page 2 test answer 1",
            "key": "design"
          },
          {
            "text": "Test page 2 test answer 2",
            "key": "print"
          },
          {
            "text": "Test page 2 test answer 3",
            "key": "code"
          }
        ]
      },
      {
        "question": "Test page 3 question",
        "answers": [
          {
            "text": "Test page 3 test answer 2",
            "key": "print"
          },
          {
            "text": "Test page 3 test answer 1",
            "key": "design"
          },
          {
            "text": "Test page 3 test answer 3",
            "key": "code"
          }
        ]
      },
      {
        "question": "Test page 4 question",
        "answers": [
          {
            "text": "Test page 4 test answer 3",
            "key": "code"
          },
          {
            "text": "Test page 4 test answer 1",
            "key": "design"
          },
          {
            "text": "Test page 4 test answer 2",
            "key": "print"
          }
        ]
      },
      {
        "question": "Test page 5 question",
        "answers": [
          {
            "text": "Test page 5 test answer 3",
            "key": "code"
          },
          {
            "text": "Test page 5 test answer 2",
            "key": "print"
          },
          {
            "text": "Test page 5 test answer 1",
            "key": "design"
          }
        ]
      }
    ]
  },

  classes: [
    {
      "title": "Magazine Publishing",
      "courseno": 246,
      "weights": {
        "code": .15,
        "design": .65,
        "print": .15,
        "mgmt": .05
      }
    },
    {
      "title": "Advanced Workflow",
      "courseno": 266,
      "weights": {
        "code": .40,
        "design": .10,
        "print": .30,
        "mgmt": .20
      }
    },
    {
      "title": "Digital Asset Management",
      "courseno": 336,
      "weights": {
        "code": .60,
        "design": .05,
        "print": .15,
        "mgmt": .20
      }
    },
    {
      "title": "Media Law",
      "courseno": 355,
      "weights": {
        "code": .00,
        "design": .00,
        "print": .10,
        "mgmt": .90
      }
    },
    {
      "title": "Multimedia Strategies",
      "courseno": 356,
      "weights": {
        "code": .15,
        "design": .10,
        "print": .15,
        "mgmt": .60
      }
    },
    {
      "title": "Media Distribution & Transmission",
      "courseno": 359,
      "weights": {
        "code": .05,
        "design": .05,
        "print": .10,
        "mgmt": .80
      }
    },
    {
      "title": "Digital Print Processes",
      "courseno": 361,
      "weights": {
        "code": .05,
        "design": .10,
        "print": .75,
        "mgmt": .10
      }
    },
    {
      "title": "Media Industries Analysis",
      "courseno": 363,
      "weights": {
        "code": .00,
        "design": .05,
        "print": .15,
        "mgmt": .80
      }
    },
    {
      "title": "Digital News Systems Management",
      "courseno": 364,
      "weights": {
        "code": .25,
        "design": .25,
        "print": .25,
        "mgmt": .25
      }
    },
    {
      "title": "Introduction to Book Design",
      "courseno": 366,
      "weights": {
        "code": .05,
        "design": .65,
        "print": .20,
        "mgmt": .10
      }
    },
    {
      "title": "Image Processing Workflow",
      "courseno": 367,
      "weights": {
        "code": .00,
        "design": .80,
        "print": .20,
        "mgmt": .00
      }
    },
    {
      "title": "Gravure and Flexography",
      "courseno": 368,
      "weights": {
        "code": .00,
        "design": .05,
        "print": .80,
        "mgmt": .15
      }
    },
    {
      "title": "Bookbinding",
      "courseno": 369,
      "weights": {
        "code": .00,
        "design": .45,
        "print": .45,
        "mgmt": .10
      }
    },
    {
      "title": "Print Finishing Management",
      "courseno": 371,
      "weights": {
        "code": .00,
        "design": .15,
        "print": .55,
        "mgmt": .30
      }
    },
    {
      "title": "Lithographic Process",
      "courseno": 376,
      "weights": {
        "code": .00,
        "design": .15,
        "print": .80,
        "mgmt": .05
      }
    },
    {
      "title": "Advanced Retouching & Restoration",
      "courseno": 377,
      "weights": {
        "code": .00,
        "design": .85,
        "print": .10,
        "mgmt": .05
      }
    },
    {
      "title": "3D Printing Workflow",
      "courseno": 386,
      "weights": {
        "code": .25,
        "design": .35,
        "print": .40,
        "mgmt": .00
      }
    },
    {
      "title": "Printing Process Control",
      "courseno": 457,
      "weights": {
        "code": .10,
        "design": .10,
        "print": .55,
        "mgmt": .25
      }
    },
    {
      "title": "Operations Management in the GA",
      "courseno": 503,
      "weights": {
        "code": .00,
        "design": .20,
        "print": .10,
        "mgmt": .70
      }
    },
    {
      "title": "Limited Edition Print",
      "courseno": 543,
      "weights": {
        "code": .00,
        "design": .10,
        "print": .90,
        "mgmt": .00
      }
    },
    {
      "title": "Color Management Systems",
      "courseno": 544,
      "weights": {
        "code": .10,
        "design": .30,
        "print": .30,
        "mgmt": .30
      }
    },
    {
      "title": "Sustainability in GA",
      "courseno": 550,
      "weights": {
        "code": 00,
        "design": .25,
        "print": .10,
        "mgmt": .65
      }
    },
    {
      "title": "Package Printing",
      "courseno": 558,
      "weights": {
        "code": .00,
        "design": .30,
        "print": .50,
        "mgmt": .20
      }
    },
    {
      "title": "Industry Issues & Trends",
      "courseno": 561,
      "weights": {
        "code": .10,
        "design": .20,
        "print": .30,
        "mgmt": .40
      }
    },
    {
      "title": "Estimating Practice",
      "courseno": 563,
      "weights": {
        "code": .10,
        "design": .10,
        "print": .40,
        "mgmt": .40
      }
    },
    {
      "title": "Typography Research",
      "courseno": 566,
      "weights": {
        "code": .00,
        "design": .60,
        "print": .10,
        "mgmt": .30
      }
    }
  ]
}
