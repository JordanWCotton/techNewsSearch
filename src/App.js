import React, { Component } from 'react';
import './App.css';

const isSearched = searchTerm => item =>
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const API_URL = 'https://hn.algolia.com/api/v1/search?query=';
const SEARCH_VAR = 'redux';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { //This allows state to be set.
      result: null,
      searchTerm: SEARCH_VAR, //Place a variable here in the future
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this); //This is how you define methods to affect state
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault(); //Prevents page reloading from submit callback
  }

  setSearchTopStories(result) {
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm) {
    fetch(API_URL + searchTerm)
     .then(response => response.json())
     .then(result => this.setSearchTopStories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onDismiss(id) { //Filters out the group by the ID that the button clicked passes in
    const isNotId = item => item.objectID !== id; 
    const updatedHits = this.state.result.hits.filter(isNotId);  
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, result } = this.state;

    return ( 
      <div className="App">
        <Search 
        value={searchTerm}
        onChange={this.onSearchChange}
        onSubmit={this.onSearchSubmit}
        >
          Search:
        </Search>
        { result ? 
        <Table 
        list={result.hits}
        onDismiss={this.onDismiss}
        />
        : null}
      </div>
    );
  }
}

const Search = ({value, onChange, onSubmit, children}) => 
  <form className="my-form" onSubmit={onSubmit}>
    <input 
    type="text"
    value={value}
    onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Table = ({list, onDismiss}) => {
  return (
    <div>
      {list.map(item => 
      <div key={item.objectID} className="list-display">
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