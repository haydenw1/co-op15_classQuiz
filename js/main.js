//main object for the class quiz
var quiz = {



  /**
   * setUp
   *   Main function that is called from 'index.html' to create quiz elements,...
   *   dynamically size elements, and bind and define event listeners.
   */
  setUp: function(){
    console.log(quiz.data);
  },



  //main data object that holds the questions for the user and the user's answers
  data: {
    answers: {},

    questions: [
      {
        "q0": "Test page 1 test question 1",
        "q1": "Test page 1 test question 2",
        "q2": "Test page 1 test question 3",
      },
      {
        "q0": "Test page 2 test question 1",
        "q1": "Test page 2 test question 2",
        "q2": "Test page 2 test question 3",
      },
      {
        "q1": "Test page 3 test question 2",
        "q2": "Test page 3 test question 3",
        "q0": "Test page 3 test question 1",
      },
      {
        "q0": "Test page 4 test question 1",
        "q1": "Test page 4 test question 2",
        "q2": "Test page 4 test question 3",
      },
      {
        "q0": "Test page 5 test question 1",
        "q1": "Test page 5 test question 2",
        "q2": "Test page 5 test question 3",
      },
    ]
  }
}
