import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  },
  {
    title: 'Angular',
    url: 'https://angular.io/docs/ts/latest/',
    author: 'Google',
    num_comments: 4,
    points: 10,
    objectID: 2
  },
  {
    title: 'Typescript',
    url: 'https://www.typescriptlang.org/docs/home.html',
    author: 'Microsoft',
    num_comments: 11,
    points: 2,
    objectID: 3
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
        <Search 
        value={searchTerm}
        onChange={this.onSearchChange}
        >
          Search:
        </Search>
        <Table 
        list={list}
        pattern={searchTerm}
        onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

const Search = ({value, onChange, children}) => 
  <form>
    {children} <input 
    type="text"
    value={value}
    onChange={onChange}
    />
  </form>

const Table = ({list, pattern, onDismiss}) => {
  return (
    <div>
      {list.filter(isSearched(pattern)).map(item => 
      <div key={item.objectID} className="test-class">
        <div>
          <a href={item.url}>{item.title}</a>
        </div>
        <div>{item.author}</div>
        <div>{item.num_comments} comments</div>
        <div>{item.points} points</div>
        <div>
          <Button 
          onClick={() => onDismiss(item.objectID)}>
          Dismiss
          </Button>
        </div>
      </div>
      )}
    </div>
  );
}

const Button = ({onClick, className = '', children}) => 
  <button 
  onClick={onClick}
  className={className}
  type="button"
  >
   {children}
  </button>

export default App;

/* 
This project demonstrates the following:
  -Setting state
  -Deleting something from the state
  -Searching, which returns real-time results for matching
  -Setting an uncontrolled component 'html input's value' to be a controlled component
  -Splitting up components
  -Passing elements from parent to child components
  -Reusable components
  -Refactoring components without state into Functional Stateless Components
  -Applying styles to components using className and CSS file
*/