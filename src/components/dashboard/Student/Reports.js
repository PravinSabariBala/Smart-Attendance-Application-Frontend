import React,{ useState, useEffect } from 'react';
import {Box,IconButton, Button} from '@mui/material';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { Chart } from 'react-google-charts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    colors: {
        color: theme.palette.text.secondary,
    },
    
    submitButton: {
        margin: theme.spacing(2),
        width: '200px'
    },
}
));
function Reports() {
    const classes = useStyles();
    const [pieData, setPieData] = useState([]);
    const [courses, setCoursesData] = useState([]);

    function generateChartData(courseId) {
        // Initialize variables to count present and absent
        let presentCount = 0;
        let absentCount = 0;
      
        // Calculate the counts
        pieData.forEach((data) => {
            
            if (data.course_code === courseId) {
                // console.log();
                if (data.attendance === 'P') {
                    presentCount++;
                } else if (data.attendance === 'A') {
                    absentCount++;
                }
            }
        });
        

        const chartData = [['Attendance', 'Count'], ['Present', presentCount], ['Absent', absentCount]];
        // console.log(chartData);
        return chartData;
    }

    function generateWorkbook(data) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        return workbook;
    }
    function handleDownload() {
        console.log("inside download");
        const workbook = generateWorkbook(pieData);  
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelData, 'attendance_data.xlsx');
    }
    useEffect(() => {
        const retrieve = async () => {
          const loginQuery = `SELECT * FROM Student_Attendance;`;
          const loginRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: loginQuery}),
          };
      
          const URL = 'http://localhost:5000/attendance';
          try {
            const resp = await fetch(URL, loginRequestOptions)
            .then(response => response.json())
            .then(response => setPieData(response));

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
    <>
        <div className={classes.root}>
        
          <Button 
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={()=>handleDownload()}
            id="download"
          >
              <IconButton>
                <DownloadOutlinedIcon />
              </IconButton>
              Download Reports
            </Button>
    
        {courses.map((course) => (
            <Box component="main"  key={course.course_code} sx={{ p: 4 }}>
            <Chart
              chartType="PieChart"
              data={generateChartData(course.course_code)}
              options={{ title: 'Attendance Report for '+ course.course_code, is3D: true }}
              width="100%"
              height="300px"
            />
            </Box>
        
      ))}
        
    </div>
    </>
    );
}

export default Reports;