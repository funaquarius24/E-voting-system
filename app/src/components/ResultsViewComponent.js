import React from "react";
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
import './Parties.css'
import MuiAlert from '@material-ui/lab/Alert'; 

const headCells = [
  {
    id: "logo",
    numeric: false,
    disablePadding: true,
    label: "Party Logo"
  },
  { id: "party", numeric: false, disablePadding: false, label: "Party" },
  { id: "candidateName", numeric: true, disablePadding: false, label: "Vote Count" }
];

function EnhancedTableHead(props) {

  return (
    <TableHead>
      <TableRow>
          
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "default"}
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
  const { winnerAndRunner, numSelected } = props;
  const winner = {};
  const runner = {};
  var multiwinner = true;
  let processWinner = function(){
    var count = 0;
    winnerAndRunner.forEach(element => {
      if(count == 0){
        winner[element[0]] = element[1];
        count++;
      }
      else{
        runner[element[0]] = element[1];
      }  
    });
    Object.values(winner) == Object.values(runner) ? multiwinner = true : multiwinner = false;
    
  }
  processWinner();


  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Winner: {Object.keys(winner)[0]} {Object.values(winner)[0]}
        </Typography>
        {
          multiwinner ? 
          (
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Winner: {Object.keys(runner)[0]} {Object.values(runner)[0]}
            </Typography>
          ) :
          (
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Runner Up: {Object.keys(runner)[0]} {Object.values(runner)[0]}
            </Typography>
          )
        }

        
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: 20
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 300
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

var winnerAndRunner = {};
export default function ResultsViewComponent(props) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);

  const {candidates, votingResult} = props;

  const candidatesData = {};
  
  candidates.forEach(element => {
      candidatesData[element.Acronym] = element.candidate_name;
  });

  const isSelected = name => selected === name;

  let winner = function(){  

    var items = Object.keys(votingResult).map(function(key) {
      return [key, votingResult[key]];
    });
    
    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    winnerAndRunner = items.slice(0, 2);
  }

  winner();
   

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} winnerAndRunner={winnerAndRunner} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              rowCount={parties.length}
            />
            <TableBody>
              {parties.map((row, index) => {
                const isItemSelected = isSelected(row.Acronym);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.Acronym}
                    selected={isItemSelected}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <img
                        className="party-image"
                        src={
                          process.env.PUBLIC_URL +
                          "/images/parties/" +
                          row.Acronym +
                          ".jpg"
                        }
                        alt="Party Img Here "
                      />
                    </TableCell>
                    <TableCell align="center">{row.Acronym}</TableCell>
                      <TableCell align="center">{votingResult[row.Acronym]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
        </TableContainer>
      </Paper>
    </div>
  );
}
