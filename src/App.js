import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
const Entities = require('html-entities').Html5Entities;
const entities = new Entities();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: null,
      startTime: null,
      endTime: null,
      answers: null,
      showResults: false,
      results: null
    }
  }

  fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&type=boolean')
      .then(results => {
        return results.json();
      }).then(data => {
        this.setState({
          questions: data.results,
          startTime: moment(),
          answers: ['','','','','','','','','',''],
          showResults: false
        })
      });
  }

  handleBtnInput(index, value) {
    var original = this.state.answers;
    var answers = JSON.parse(JSON.stringify(original));
    answers[index] = value;
    this.setState({
      answers: answers
    });
  }

  showResults() {
    var count = 0;
    var questions = this.state.questions;
    var answers = this.state.answers;
    for (var i=0; i<questions.length;i++) {
      if (questions[i].correct_answer === answers[i]) {
        count++;
      }
    }
    this.setState({
      endTime: moment(),
      showResults: true,
      results: count
    });
  }

  render() {

    var questionList = this.state.questions && this.state.questions.map((item, index) => {
      var answers = this.state.answers;
      return (
        <div className="questionHolder" key={index}>
          <div className="questionNumber">{index + 1})</div>
          <div className="questionText">{entities.decode(item.question)}</div>
          <div className="answerHolder">
            <input type="button" className={answers[index] === "True" ? "answerBtn active" : "answerBtn" } value="True" onClick={() => this.handleBtnInput(index,"True")} />
            <input type="button" className={answers[index] === "False" ? "answerBtn active" : "answerBtn" } value="False" onClick={() => this.handleBtnInput(index,"False")} />
          </div>
        </div>
      );
    });

    return (
      <div className="App">
        <h1>Trivia Quiz App</h1>
        <button className="defaultBtn" onClick={() => this.fetchQuestions()}>Start Quiz</button>
        {this.state.questions && !this.state.showResults &&
          <div className="questionsContainer"> 
            {questionList}
            <button onClick={() => this.showResults()}>Get your results</button>
          </div>
        }
        {this.state.showResults &&
          <div className="resultsContainer">
            <div>Your score is: {this.state.results} </div>
            <div>You finished the test in {this.state.endTime.diff(this.state.startTime, 'minutes')} minutes</div>
            <button className="defaultBtn" onClick={() => this.fetchQuestions()}>Play again</button>
          </div>
        }
      </div>
    );
  }
}

export default App;
