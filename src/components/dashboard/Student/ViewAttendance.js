import React,{ useState, useEffect } from 'react';
import{
    Button,
    MenuItem,
    Grid,
    Select,
    FormControl, 
    InputLabel,
} from "@mui/material";

import Table from './Table'
import Calendar from "react-calendar";
import Popup from './Popup'
import Paper from "@material-ui/core/Paper";
import "react-calendar/dist/Calendar.css";

import { makeStyles } from "@material-ui/core/styles";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const dayjs = require("dayjs")
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
    formControl: {
      margin: theme.spacing(1),
    },
    submitButton: {
      margin: theme.spacing(2),
    },
  }));
const Attendance =() =>
{
    const classes = useStyles();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [courseId, setCourseId] = useState("");
    const [facultyId, setFacultyId] = useState("");
    const [tableData, setTableData] = useState([]);
    const [courses, setCoursesData] = useState([]);
    const [faculties, setFacultiesData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [highlightedDates, setHighlightedDates] = useState([]);

    const handleCourseIdChange = (event) => {
        setCourseId(event.target.value);
    };

    const handleFacultyIdChange = (event) => {
        setFacultyId(event.target.value);
    };
    const handleStartDateChange = (date) => {
        let formattedDate = dayjs(date.$d).format('YYYY-MM-DD');
        setStartDate(formattedDate);
    };
    
    const handleEndDateChange = (date) => {
      let formattedDate = dayjs(date.$d).format('YYYY-MM-DD');
      setEndDate(formattedDate);
    };

    const tileContent = ({ date, view }) => {
      if (view === 'month' && highlightedDates.find(x => x.date.toDateString() === date.toDateString() && x.attendance === 'A')) {
          return <div style={{ backgroundColor: 'red', borderRadius: '50%', height: '80%', width: '80%', margin: '10%' }}></div>;
      }
      else if (view === 'month' && highlightedDates.find(x => x.date.toDateString() === date.toDateString() && x.attendance === 'P')) {
          return <div style={{ backgroundColor: 'green', borderRadius: '50%', height: '80%', width: '80%', margin: '10%' }}></div>;
      }
      return null;
    };

    const fetchData =  async () => {
        
        if (courseId==="" || facultyId==="" || startDate == "" || endDate===""){
          setErrorMessage('Please fill in all fields.');
          return ;
        }
        else{
          setErrorMessage('');
        }
        var loginQuery = `SELECT * FROM Student_Attendance WHERE course_code = '${courseId}' AND faculty_id = '${facultyId}' AND class_date >= '${startDate}' AND class_date <= '${endDate}'`;
        if (courseId=="Select All" && facultyId=="Select All"){
          loginQuery = `SELECT * FROM Student_Attendance WHERE class_date >= '${startDate}' AND class_date <= '${endDate}'`;
        }
        else if (courseId=="Select All"){
          loginQuery = `SELECT * FROM Student_Attendance WHERE faculty_id = '${facultyId}' AND class_date >= '${startDate}' AND class_date <= '${endDate}'`;
        }
        else if (facultyId=="Select All"){
          loginQuery = `SELECT * FROM Student_Attendance WHERE course_code = '${courseId}' AND class_date >= '${startDate}' AND class_date <= '${endDate}'`;
        }
        const loginRequestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: loginQuery}),
        // mode: 'cors',
        };
    
        // Define mysql localhost url
        const URL = 'http://localhost:5000/attendance';
        // console.log(loginRequestOptions)
        try {
        const resp = await fetch(URL, loginRequestOptions);
        const data = await resp.json();

        if(data) { 
          setTableData(data);
          let dates = [];
          data.forEach((item) => {
            dates.push({'date':new Date(item.class_date),'attendance':item.attendance});
          });
          setHighlightedDates(dates);         

        }

        } catch (e) {
        // showError();
        }
    };
    useEffect(() => {
      const retrieve = async () => {
        const loginQuery = `SELECT DISTINCT teacher_id from Faculty;`;
        const loginRequestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: loginQuery}),
        };
    
        const URL = 'http://localhost:5000/fetch';
        try {
        const resp = await fetch(URL, loginRequestOptions)
        .then(response => response.json())
        .then(response => setFacultiesData(response));
        
        
        loginRequestOptions.body=JSON.stringify({ query: `select distinct course_code from Course;`})
        resp = await fetch(URL, loginRequestOptions)
        .then(response =>  response.json())
        .then(response => setCoursesData(response));;
        

        } catch (e) {
        }
      }
      retrieve();
    }, []);


    return (
        <div className={classes.root}>
        <Popup />
       
        <FormControl className={classes.formControl} sx={{m:1,minWidth: 120,}}>
          <InputLabel id="course_id_label">Course ID</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select-required"
            // value={"19CSE311"}
            onChange={(event) => handleCourseIdChange(event)}
          >
            <MenuItem 
                value="Select All"
                style={{display: 'flex'}}
              >
                Select All
              </MenuItem>
            {courses.map((course) => (
              <MenuItem 
                key={course.course_code} 
                value={course.course_code}
                style = {{ display: 'flex'}}
              >
                {course.course_code }
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl} sx={{m:1,minWidth: 120,}}>
          <InputLabel id="faculty_id_label">Faculty ID</InputLabel>
          <Select
            
            labelId="faculty_id_label"
            id="demo-simple-select-required"
            // value={"T001"}
            onChange={(event) => handleFacultyIdChange(event)}
          >
            <MenuItem 
                value="Select All"
                style={{display: 'flex'}}
              >
                Select All
              </MenuItem>
            {faculties.map((faculty) => (
              <MenuItem 
                key={faculty.teacher_id} 
                value={faculty.teacher_id} 
                style = {{ display: 'flex' }}
              >
                {faculty.teacher_id}
              </MenuItem>
            ))} 
          </Select>
        </FormControl>
        
        
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Enter Start Date" sx={{m:1,minWidth: 120,}} onChange={(date) => handleStartDateChange(date)}/>
          <DatePicker label="Enter End Date" sx={{m:1,minWidth: 120,}} onChange={(date) => handleEndDateChange(date)}/>
          
      </LocalizationProvider>
      
      <br />
      <Button
          className={classes.submitButton}
          variant="contained"
          color="primary"
          type="submit"
          sx={{m:1,minWidth: 120,}}
          onClick={(e) => {fetchData(); e.preventDefault();}}
        >
          Submit
       </Button> 
        <span style={{color:'red'}}>
        <h3>
        {errorMessage && <p>{errorMessage}</p>}
        </h3>
        </span>
        <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
            <Table data={tableData} />
        </Grid>
        <Grid item xs={12} md={4}>
        <Paper className={classes.paper}>
            <Calendar tileContent={tileContent}
            />
        </Paper>
        </Grid>
        </Grid>
        </div> 
    );
}

export default Attendance;