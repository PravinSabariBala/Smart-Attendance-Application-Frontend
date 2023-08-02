import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
      height: "100%",
    },
    table: {
      minWidth: 650,
    },
  }));

function Calender() {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [dates, setDates] = useState(new Map());
  
    // useEffect(() => {
    //   fetch("/api/data")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setRows(data);
    //     });
    // }, []);
  
    // useEffect(() => {
    //   fetch("/api/calendar")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       const map = new Map();
    //       data.forEach((date) => {
    //         map.set(date.date, date.isAvailable);
    //       });
    //       setDates(map);
    //     });
    // }, []);
  
    const getCellColor = (date) => {
      if (dates.has(date)) {
        return dates.get(date) ? "green" : "red";
      }
      return null;
    };
  
    return (
      <>    
        <Paper className={classes.paper}>
            <Calendar
                tileContent={({ date }) => (
                  <div
                    style={{
                      backgroundColor: getCellColor(date.toISOString().slice(0, 10)),
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                )}
              />
        </Paper>
    </>  
    );
  }
  
  export default Calender;