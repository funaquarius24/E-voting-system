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
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import parties from "../parties.json";
import './Parties.css'
import {Vote} from '../utils/ServerConnection';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

const headCells = [
  {
    id: "logo",
    numeric: false,
    disablePadding: true,
    label: "Party Logo"
  },
  { id: "party", numeric: false, disablePadding: false, label: "Party" },
  { id: "candidateName", numeric: false, disablePadding: false, label: "Name" }
];

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EnhancedTableHead(props) {

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
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
          Select And Vote
        </Typography>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
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

export default function App(props) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [voteSuccess, setVoteSuccess] = React.useState("error");

  // Hmmm... getting very annoying. but this is the last place. 
  const {candidates, address} = props;
  const voteMessages = 
  {'success': "Successfully Voted!", 
  "error": "Vote Failed. You either don't have a right to vote or you've already voted."};

  const handleSnackOpen = () => {
    setOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const candidatesData = {};
  
  candidates.forEach(element => {
      candidatesData[element.Acronym] = element.candidate_name;
  });

  const handleClick = (event, name) => {
    if(selected === name){
      setSelected("")
    }
    else{
      setSelected(name);
    }

  };

  const handleVoteAttempted = (success) => {
    if(success){
      handleSnackOpen();
      setVoteSuccess("success");
      console.log("Success!!!!!!!!!");
    }else{
      setVoteSuccess("error")
      handleSnackOpen();
      console.log("Failed!!!!!!!!!!!!");
    }
  }

  const handleVoteButtonClick = () => {
    if(address.length > 0){
      Vote(address, selected, handleVoteAttempted);

    }
  }

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
              rowCount={parties.length}
            />
            <TableBody>
              {parties.map((row, index) => {
                const isItemSelected = isSelected(row.Acronym);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row.Acronym)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.Acronym}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
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
                      <TableCell align="center">{candidatesData[row.Acronym]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button className="vote-button" color="primary" variant="contained" onClick={handleVoteButtonClick}>Vote <span><ThumbUpAltRoundedIcon color="secondary" /></span> </Button>
        </TableContainer>
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={voteSuccess}>
          {
            voteSuccess === "success" ? (
              voteMessages.success
            ) : (
              voteMessages.error
            )
          }
        </Alert>
      </Snackbar>
    </div>
  );
}
