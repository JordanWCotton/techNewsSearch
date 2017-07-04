import React, { Component } from 'react';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import './App.css';

const API_URL = 'https://hn.algolia.com/api/v1/search?query=';
const PAGE_QUERY = '&page=';
const PAGE_HPP = '&hitsPerPage=';

const defaultPage = 0;
const defaultSearch = 'redux';
const defaultHPP = '40';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list,'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      result: null,
      searchKey: '',
      searchTerm: defaultSearch,
      isLoading: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this); 
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm, defaultPage);
    }
    
    event.preventDefault(); //Prevents page reloading from form's submit callback
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page}
      },
      isLoading: false
    });
  }

  fetchSearchTopStories(searchTerm, page) {
    this.setState({ isLoading: true });

    fetch(API_URL + searchTerm + PAGE_QUERY + page + PAGE_HPP + defaultHPP)
     .then(response => response.json())
     .then(result => this.setSearchTopStories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm, defaultPage);
  }

  onDismiss(id) { 
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id; 
    const updatedHits = hits.filter(isNotId);  

    this.setState({ 
      results: { 
        ...results, 
        [searchKey]: { hits: updatedHits, page}
      }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, results, searchKey, isLoading, sortKey, isSortReverse } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0; 
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return ( 
      <div className="App">
        <Search 
        value={searchTerm}
        onChange={this.onSearchChange}
        onSubmit={this.onSearchSubmit}
        >
          Search
        </Search>
        { results ? 
        <Table 
        list={list}
        onSort={this.onSort}
        sortKey={sortKey}
        onDismiss={this.onDismiss}
        isSortReverse={isSortReverse}
        />
        : null}
        <div>
          <ButtonWithLoading 
          isLoading={isLoading}
          onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
        <span className="stay-right">Powered by HackerNews Article Search API</span>
      </div>
    );
  }
}

class Search extends Component {

  componentDidMount() {
    this.input.focus();
  }

  render() {
    const {
      value,
      onChange,
      onSubmit,
      children
    } = this.props;

    return (
      <form className="my-form" onSubmit={onSubmit}>
        <span className="app-title">Tech News Search</span>
        <div className="stay-right">
        <input
        type="text"
        value={value}
        onChange={onChange}
        ref={(node) => { this.input = node; }}
        />
        <button type="submit" className="submit-button">
          {children}
        </button>
        </div>
      </form>
    )
  }
}

class Table extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  //Sets sortKey in the state to the passed value, after checking to see if this needs to be a reverse sort and display
  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse; 
    this.setState({ sortKey, isSortReverse });
  }

  render() {

    const {
      list,
      onDismiss,
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const finalList = isSortReverse ? sortedList.reverse() : sortedList;

    return (
      <div className="list-container">
        <div>
          <span>
            <Sort 
            sortKey={'TITLE'}
            onSort={this.onSort}
            activeKey={sortKey}
            >
              Title
            </Sort>
          </span>
          <span>
            <Sort 
            sortKey={'AUTHOR'}
            onSort={this.onSort}
            activeKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span>
            <Sort 
            sortKey={'COMMENTS'}
            onSort={this.onSort}
            activeKey={sortKey}
            >
              Comments
            </Sort>
          </span>
          <span>
            <Sort 
            sortKey={'POINTS'}
            onSort={this.onSort}
            activeKey={sortKey}
            >
              Points
            </Sort>
          </span>
        </div> 
        {finalList.map(item => 
          <div key={item.objectID} className="list-display">
            <div>
              <a href={item.url}>{item.title}</a>
            </div>
            <div><span className="bold-sect">Author:</span> {item.author}</div>
            <div><span className="bold-sect">Comments:</span> {item.num_comments} comments</div>
            <div><span className="bold-sect">Points:</span> {item.points}</div>
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
}

const Sort = ({sortKey, onSort, activeSort, children}) => {
  let sortClass = '';

  if (sortKey === activeSort) {
    sortClass = 'active-btn';
  }

  return (
    <Button 
    onClick={() => onSort(sortKey)}
    className={sortClass}
    >
      {children}
    </Button>
  )
}
 

const Button = ({onClick, className = '', children}) => 
  <button 
  onClick={onClick}
  className={className}
  type="button"
  >
   {children}
  </button>

  Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };


const Loading = () => 
  <div>Loading...</div>

const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading ? <Loading /> : <Component{...rest} />

const ButtonWithLoading = withLoading(Button); 

export default App;