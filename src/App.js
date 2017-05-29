import React, { Component } from 'react';
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
  },
  {
    title: 'angular',
    url: 'https://angular.io/docs/ts/latest/',
    author: 'Google',
    num_comments: 4,
    points: 10,
    objectID: 2
  },
  {
    title: 'typescript',
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

class Search extends Component {
  render() {
    const { value, onChange, children } = this.props; //Getting these from parent component, passed on the tag
    return (
      <form>
        {children} <input //Uses children to display elements passed from the parent component
        type="text"
        value={value}
        onChange={onChange}
        />
      </form>
    );
  }
}

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props; //Getting these from parent component, passed on the tag
    return (
      <div>
        { list.filter(isSearched(pattern)).map(item => 
        <div key={item.objectID}>
          <span>
            <a href={item.url}>{item.title}</a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_components}</span>
          <span>{item.points}</span>
          <span>
            <Button 
            onClick={() => onDismiss(item.objectID)}>
            Dismiss 
            </Button>
          </span>
        </div>
        )}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const { 
      onClick,
      className,
      children
    } = this.props;

    return (
      <button
      onClick={onClick}
      className={className}
      type="button"
      >
       {children}
       </button>
    );
  }
}





export default App;

/* This demonstrates the following:
  -Setting state
  -Deleting something from the state
  -Searching, which returns real-time results for matching
  -Setting an uncontrolled component 'html input's value' to be a controlled component
  -Splitting up components
  -Passing elements from parent to child components

*/