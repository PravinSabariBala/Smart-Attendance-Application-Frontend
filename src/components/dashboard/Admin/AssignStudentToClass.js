import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    userInputField: {
        width: '100%',
        margin: theme.spacing(1, 1, 3, 1),
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function AssignStudentToClass() {
    const classes = useStyles();

    const [email, setEmail] = React.useState('');
    
    const [password, setPassword] = React.useState('');
    
    const [section, setSection] = React.useState('');
    const [studentID, setStudentID] = React.useState('');
    const [courseCode, setCourseCode] = React.useState('');
    
    const [invalidQuery, setInvalidQuery] = React.useState(false);
    const [inserted, setinserted] = React.useState(false);

    const handleSubmit = async(event) => {
        event.preventDefault()

        const queryOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            
            
            body:JSON.stringify({query:`INSERT INTO Class_Enrollment (course_code, section, student_id) VALUES ('${courseCode}', '${section}', '${studentID}');`})
          };
      
          // Validation for course code and course title.
        //   if (courseCode ==="" || courseTitle === "") {
        //     setInvalidQuery(true);
        //   }
          console.log(queryOptions);
      
          // Define mysql localhost URL   
          const URL = 'http://localhost:5000/admin';
      
          try {
            const resp = await fetch(URL, queryOptions);
            const data = await resp.json();
            console.log(data)
            // var columnHeadings = Object.keys(data[0]);
            // console.log(columnHeadings,"hguh")
            if (data.affectedRows) {    
            
                setinserted(true);
            }
            else {
                  setInvalidQuery(true);
            }
      
          } catch (e) {
      
            // setInvalidQuery(true);
            console.log(e);
      
      
            console.log("INVALID QUERY WAS ENTERED");
      
          }
        
    }

    return <>
        <Container component="main" maxWidth="m">
            <h2>Assign Students To Class</h2>
            <div className={classes.paper}>
                <form autoComplete="off" onSubmit={handleSubmit} className={classes.form}>
                    <TextField
                        label="Course Code"
                        onChange={e => setCourseCode(e.target.value)}
                        required
                        autoFocus
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        type="courseCode"

                        value={courseCode}
                    />
                    <Box sx={{ marginTop: '10px' }} />
                    <TextField
                        label="Section"
                        onChange={e => setSection(e.target.value)}
                        required
                        variant="outlined"
                        fullWidth
                        color="secondary"
                        type="section"
                        value={section}
                    />  
                    <TextField
                        label="Student ID"
                        onChange={e => setStudentID(e.target.value)}
                        required
                        variant="outlined"
                        color="secondary"
                        type="studentID"
                        value={studentID}
                        fullWidth
                    />
                    <Button variant="outlined" color="secondary" type="submit" classes={classes.userInputField}>Assign Student To Class</Button>
                </form>
            </div>
        </Container>
        <Dialog open={invalidQuery} onClose={() => { setInvalidQuery(false); setinserted(false); }}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Invalid Query. Please check and try again. Check your details properly!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setInvalidQuery(false); }} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={inserted} onClose={() => { setInvalidQuery(false); setinserted(false); }}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Entry stored in database
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setInvalidQuery(false); setinserted(false);}} color="primary">
            OK
          </Button>
        </DialogActions>
        </Dialog>
    </>
}
export default AssignStudentToClass;