import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import parties from "../parties.json";
import "./AddCandidateComponent.css"
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import CancelIcon from '@material-ui/icons/Cancel';
import { Save } from "@material-ui/icons";
import Button from '@material-ui/core/Button';

const headCells = [
  { id: "party", numeric: false, label: "Party" },
  { id: "candidate-name", numeric: false, label: "Candidate Name" } 
];

function EnhancedTableHead(props) {

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align="center"
          >
              {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { selected, numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Change Candidate Name
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    textAlign: 'center',
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

function EditCandidateInput(props){
    const [view, setView] = React.useState(true)
    
    const {Acronym, candidateNameProp, handleEditPost} = props;
    const [candidateName, setCandidateName] = React.useState(candidateNameProp)
    console.log(candidateName);

    const handlePartyNameClick = (event, name) => {
        if(name === "edit"){
            setView(false);
        }
        else if(name === "cancel") {
            setView(true);
        }
        else {
            handleEditPost({candidateName: name, Acronym: Acronym});
            setView(true);
        }
    }
    
    return (
        <TableCell align="center">
            {
                view ?
                (<div className="paper-left">
                    {candidateName}
                    <span>
                        <EditRoundedIcon onClick={event => handlePartyNameClick(event, "edit")} fontSize="small"></EditRoundedIcon></span>
                </div>) :
                (   <div>
                        <input className="paper-left bordered-input" type="text" 
                            defaultValue={candidateName} onChange={event => setCandidateName(event.target.value)} ></input>
                        <span className="button-right">
                            <Save onClick={event => handlePartyNameClick(event, candidateName)} fontSize="small" />
                            <CancelIcon onClick={event => handlePartyNameClick(event, "cancel")} fontSize="small" />
                        </span>
                    </div>
                )
            }
            
            
        </TableCell>
    )

}

export default function AddCandidateComponent(props) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const candidatesData = {};
  const {candidates} = props;

  
  candidates.forEach(element => {
      candidatesData[element.Acronym] = element.candidate_name;
  });

  const handleEditPost = content => {
    var data = {
        candidateName: content.candidateName,
        Acronym: content.Acronym
    }
    console.log("data: " + data)
    fetch("/candidates/edit", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(function(response) {
        if (response.status === 404){
            throw new Error("Page Not Found");
        }
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
    }).then(function(data) {
        console.log(data)    
        if(data === "success"){
           console.log("successfully saved");
        }
    }).catch(function(err) {
        console.log(err)
    });
  }

  const handleCommitAll = content => {
    var thisCandidates;
    fetch('/candidates')
      .then(res => res.json())
      .then(candidates => thisCandidates = candidates)
      .then(() => fetch('/blockchain/commitAll', {
        method: 'POST',
        headers: {'content-Type': 'application/json'},
        body: JSON.stringify(thisCandidates)
      })
      .then(res => res.text())
      .then((blockData) => {
        if( blockData.indexOf('success') !== -1){
          console.log("success");
        }else{
          console.log('failed');
        }
      }))
      .catch(function failureCallback(error){
        console.log(error);
      });
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = parties.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    let newSelected = "";

    if(selected === name){
      setSelected("")
    }
    else{
      setSelected(name);
    }

  };
  const isSelected = name => selected === name;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={parties.length}
            />
            <TableBody>
              {parties.map((row, index) => {
                const isItemSelected = isSelected(row.Name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row.Name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.Name}
                    selected={isItemSelected}
                  >
                    <TableCell align="left">{row.Name} ({row.Acronym})</TableCell>
                    <EditCandidateInput 
                        classes = {classes}
                        candidateNameProp = {candidatesData[row.Acronym]}
                        Acronym = {row.Acronym}
                        handleEditPost = {handleEditPost}

                    />
                        
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="commit_changes_button">
          <Button variant="contained" color="primary" onClick={() => handleCommitAll()}>
              Commit All Changes
          </Button>
        </div>
        
      </Paper>
    </div>
  );
}
