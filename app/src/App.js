import React, {Component} from "react";
import './App.css';
import Container from '@material-ui/core/Container';
import BackToTop from './components/BackToTop';


class App extends Component {
  state = { loading: true, candidates: null, ballotView: true};



  componentDidMount() {
    var thisCandidates = null;
    var thisLoading = true;

    fetch('/blockchain/')
      .then(res => res.text())
      .then((blockData) => {
        if( blockData.indexOf('success') !== -1){
          thisLoading = false;
        }else{
          console.log(blockData);
        }
      }).then(() => fetch('/candidates') )
      .then(res => res.json())
      .then(candidates => thisCandidates = candidates)
      .then(() => {
        this.setState({loading: thisLoading, candidates: thisCandidates});
      })
      .catch(function failureCallback(error){
        console.log(error);
      });
    
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading Drizzle..."; 
    return (
      <div className="App">         
        <div className="main-body">
          <Container maxWidth="sm" className="main-container">
            <div>
              <BackToTop candidates={this.state.candidates} />
            </div>
            
          </Container>
  
        </div>
  
      </div>
    );
  }
  
}

export default App;
