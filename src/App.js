import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'react',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

/* function isSearched(searchTerm) { //This higher order function returns a function that returns true/false for filtering the list
  return item => {
    return !searchTerm || //Filters only when a searchTerm is actually set, then matches an item's title with the searchTerm, returning true if it does which allows it to stay in the list
    item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}; */
//ES6 below, above is the equivalent function in ES5
const isSearched = searchTerm => item =>
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { //This allows state to be set.
      list,
      searchTerm: "",
    };

    this.onDismiss = this.onDismiss.bind(this); //This is how you define methods to affect state
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) { //Filters out the group by the ID that the button clicked passes in
    const isNotId = item => item.objectID !== id; 
    const updatedList = this.state.list.filter(isNotId);  
    this.setState({ list: updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="App">
        <form>
          <input type="text"
          value={searchTerm}
          onChange={this.onSearchChange} />
        </form>
        { this.state.list.filter(isSearched(this.state.searchTerm)).map((item) => { //Maps through each object in our array, and displays
          return (                                                                  //with JSX. 
            <div key={item.objectID}> 
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button onClick={() => this.onDismiss(item.objectID)}
                  type="button"> Dismiss
                </button>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const { value, onChange } = this.props; //Getting these from parent component
    return (
      <form>
        <input
        type="text"
        value={value}
        onChange={onChange}
        />
      </form>
    );
  }
}

class Table extends Component {
  
}





export default App;

/* This demonstrates the following:
  -Setting state
  -Deleting something from the state
  -Searching, which returns real-time results for matching
  -Setting an uncontrolled component 'html input's value' to be a controlled component
  -Splitting up components


*/