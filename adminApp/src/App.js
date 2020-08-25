import React, {Component} from "react";
import './App.css';
import Container from '@material-ui/core/Container';
//import Fab from '@material-ui/core/Fab';
import SignIn from './components/CreateVoter';
import AddCandidateComponent from "./components/AddCandidateComponent";


class App extends Component {
  state = { loading: true, candidates: null, voterCandidateComponent: "addCandidate"};


  componentDidMount() {
    var thisCandidates = null; 
    var thisLoading = true;

    console.log("Reached");

    fetch('/blockchain/')
      .then(res => res.text())
      .then((blockData) => { 
        console.log("reached");
        if( blockData.indexOf('success') !== -1){
          thisLoading = false;
        }else{
          thisLoading = true;
        }
      }).then(() => fetch('/candidates') )
      .then(res => res.json())
      .then(candidates => thisCandidates = candidates)
      .then(() => this.setState({loading: thisLoading, candidates: thisCandidates}))
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
            <h1 className="conf-alert">CONFIDENTIAL! </h1>
            <h2 className="conf-detail">Only authorized personels are allowed to visit this page.</h2>
            <SignIn />
            <div id="add_or_vote">
              <AddCandidateComponent candidates = {this.state.candidates} />
            </div>
            
            
          </Container>
  
        </div>
  
      </div>
    );
  }
  
}

export default App;
