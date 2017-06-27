import React, { Component } from 'react';
import './App.css';

const API_URL = 'https://hn.algolia.com/api/v1/search?query=';
const PAGE_QUERY = '&page=';

const defaultPage = 0;
const defaultSearch = 'redux';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { //This allows state to be set.
      result: null,
      searchTerm: defaultSearch, //Place a variable here in the future
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this); 
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm, defaultPage);
    event.preventDefault(); //Prevents page reloading from form's submit callback
  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    const oldHits = page !== 0 ? this.state.result.hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      result: { hits: updatedHits, page}
    });
  }

  fetchSearchTopStories(searchTerm, page) {
    fetch(API_URL + searchTerm + PAGE_QUERY + page)
     .then(response => response.json())
     .then(result => this.setSearchTopStories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm, defaultPage);
  }

  onDismiss(id) { 
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
    const page = (result && result.page) || 0; 

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
        <div>
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            More
          </Button>
        </div>
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