import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Zoom from '@material-ui/core/Zoom';
import ResultsViewComponent from './ResultsViewComponent';
import Ballot from './Ballot';
import { fade, makeStyles } from '@material-ui/core/styles';
import './BackToTop.css';
const useStyles = makeStyles((theme) => ({
    root: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    inputRoot: {
      color: 'inherit',
    },
    inputText: {
        color: 'white',
      },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      padding: 5,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(10),
        width: 'auto',
      },
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor'); 

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

var testa = "fdkfdfkd";
export default function BackToTop(props) {
    const {candidates} = props;
    const classes = useStyles();

    const [ballotView, setBallotView] = React.useState(true);
    const [address, setAddress] = React.useState("");
    const [votingResult, setVotingResult] = React.useState({});
    const tested = {resultRefresh: null, testing: "hhsjdhsjhdjs"};

    const handleInputText = (event) => {
        var addressValue = event.target.value;
         if(/^0[xX][0-9a-fA-F]+$/.test(addressValue) && addressValue.length === 42){
            setAddress(addressValue);
         }else{
            //console.log("incorrect"); 
         }
    }
    //var resultRefresh;
    //var testing;
    //var votingResult = {};

    let loadStat = function(){
      var returnResult = {};
      fetch('/blockchain/stats')
      .then(res => res.json())
      .then((data) => {
          returnResult = data;
      })
      .then(() => {
        setVotingResult(returnResult);
      })
      .catch(function failureCallback(error){
        console.log(error);
      });
    }

    const handlePageChange = (event) => {
      
      if(!event.target.checked){
        loadStat();
        tested.resultRefresh = setInterval(loadStat, 5000);
        testa = "dfjhdjfhdj";
      }
      else{
        clearInterval(tested.resultRefresh);
        //console.log(winnerAndRunner);
      }
      setBallotView(event.target.checked);
      
    };

     

  return (
    <React.Fragment>
      <CssBaseline />
      
      <AppBar >
        <Toolbar className="flex-container">
          <Typography >
            Nigerian Voting DApp
          </Typography>
          <div className={classes.search}>
            <TextField
              placeholder="Address"
              id="address" 
              label="Address" 
              classes={{
                root: classes.inputRoot,
              }}
              inputProps={{ 'aria-label': 'address' }}
              onChange={event => handleInputText(event)}
            />
          </div>
          <FormGroup style={{marginLeft: 30}}>
            <FormControlLabel
              control={<Switch checked={ballotView} onChange={handlePageChange} aria-label="page switch" />} 
              label={ballotView ? 'Results' : 'Vote'}
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
            <div> {ballotView ? (
              <Ballot candidates={candidates} address={address} />
              ) : (
                <ResultsViewComponent candidates={candidates} votingResult={votingResult} />
                )
            }

             </div>
      </Container>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
