// TimeTableGenerator2.js - Updated to work with dynamic timings in time column only
import GetData from './GetData';

class TimeTableGenerator2 {
  constructor() {
    // Reference the existing GetData service
    this.data = GetData;
    
    // Set up basic properties
    this.division = 0;
    this.Teacher = this.data.TotalTeacherData();
    this.Subject = this.data.TotalSubjectData();
    
    // Calculate timing details based on user inputs
    this.calculateTimings();
    
    // Log initialization info
    console.log("TimeTableGenerator2 initialized");
    console.log("Teachers:", this.Teacher);
    console.log("Subjects:", this.Subject);
    console.log("Divisions:", this.data.NoDivision);
    
    // Make sure TimeTable dimensions are updated
    this.data.updateTimeTableDimensions();
  }
  
  // Calculate timings based on user inputs
  calculateTimings() {
    // Parse start time
    const [startHour, startMinute] = this.data.StartTime.split(':').map(Number);
    
    // Lecture and break durations
    const lectureDuration = this.data.LectureDuration || 45;
    const breakDuration = this.data.NoBreaks || 10;
    
    // Generate period times
    this.periodTimes = [];
    let currentTime = new Date(2024, 0, 1, startHour, startMinute);
    
    for (let i = 1; i <= 7; i++) {
      // For lunch break
      if (i === 4) {
        this.periodTimes.push({
          period: i,
          startTime: this.formatTime(currentTime),
          endTime: this.formatTime(new Date(currentTime.getTime() + 30 * 60000)), // 30-minute lunch break
          type: 'Lunch Break'
        });
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      } else {
        // Regular periods
        const periodStartTime = new Date(currentTime);
        currentTime = new Date(currentTime.getTime() + lectureDuration * 60000);
        
        this.periodTimes.push({
          period: i,
          startTime: this.formatTime(periodStartTime),
          endTime: this.formatTime(currentTime),
          type: 'Lecture'
        });
        
        // Add break time between periods (except after lunch)
        if (i !== 3 && i !== 4 && i !== 7) {
          currentTime = new Date(currentTime.getTime() + breakDuration * 60000);
        }
      }
    }
    
    console.log("Period Timings:", this.periodTimes);
  }
  
  // Helper method to format time
  formatTime(date) {
    return date.toTimeString().slice(0, 5);
  }
  
  // Main method to generate the timetable
  GetValuesFromRandom() {
    console.log("Starting timetable generation...");
    
    try {
      // Use the TimeTable from GetData directly
      const timeTable = this.data.TimeTable;
      const noDivision = this.data.NoDivision || 3; // Default to 3 if not set
      
      if (!timeTable || timeTable.length === 0) {
        console.error("TimeTable array not properly initialized");
        this.data.NoDivision = 3;
        this.data.updateTimeTableDimensions();
      }
      
      // Create helper arrays for tracking teacher assignments
      const storeTeacher = Array(noDivision).fill().map(() => 
        Array(7).fill().map(() => Array(8).fill(""))
      );
      
      const storeSubject = Array(noDivision).fill().map(() => 
        Array(7).fill().map(() => Array(8).fill(""))
      );
      
      // Generate timetable for each division
      for (let i = 0; i < noDivision; i++) {
        console.log(`Generating timetable for division ${i}`);
        
        // First division gets a random assignment
        if (i === 0) {
          for (let day = 1; day <= 6; day++) {
            for (let period = 1; period <= 7; period++) {
              // Use pre-calculated period times
              const periodInfo = this.periodTimes.find(p => p.period === period);
              
              // Lunch break handling
              if (periodInfo.type === 'Lunch Break') {
                timeTable[i][day][period] = 'LUNCH BREAK';
                continue;
              }
              
              if (!this.Teacher || this.Teacher.length === 0) {
                console.warn("No teachers defined. Using default values.");
                // Use default values if Teacher array is empty
                storeTeacher[i][day][period] = `Teacher ${(day + period) % 10 + 1}`;
                storeSubject[i][day][period] = `Subject ${(day + period) % 10 + 1}`;
              } else {
                const index = Math.floor(Math.random() * this.Teacher.length);
                storeTeacher[i][day][period] = this.Teacher[index] || `Teacher ${index + 1}`;
                storeSubject[i][day][period] = this.Subject[index] || `Subject ${index + 1}`;
              }
              
              // Set the timetable entry without time labels
              timeTable[i][day][period] = `${storeSubject[i][day][period]}\n${storeTeacher[i][day][period]}`;
            }
          }
        } else {
          // For subsequent divisions, check for conflicts
          for (let day = 1; day <= 6; day++) {
            for (let period = 1; period <= 7; period++) {
              // Use pre-calculated period times
              const periodInfo = this.periodTimes.find(p => p.period === period);
              
              // Lunch break handling
              if (periodInfo.type === 'Lunch Break') {
                timeTable[i][day][period] = 'LUNCH BREAK';
                continue;
              }
              
              let foundNonConflicting = false;
              let attempts = 0;
              
              // Try to find a non-conflicting assignment
              while (!foundNonConflicting && attempts < 50) {
                attempts++;
                
                if (!this.Teacher || this.Teacher.length === 0) {
                  console.warn("No teachers defined. Using default values.");
                  const index = (day + period + attempts) % 10;
                  storeTeacher[i][day][period] = `Teacher ${index + 1}`;
                  storeSubject[i][day][period] = `Subject ${index + 1}`;
                  foundNonConflicting = true;
                  continue;
                }
                
                const index = Math.floor(Math.random() * this.Teacher.length);
                const teacher = this.Teacher[index] || `Teacher ${index + 1}`;
                const subject = this.Subject[index] || `Subject ${index + 1}`;
                
                // Check for conflicts with previous divisions
                let hasConflict = false;
                for (let prev = 0; prev < i; prev++) {
                  if (teacher === storeTeacher[prev][day][period]) {
                    hasConflict = true;
                    break;
                  }
                }
                
                if (!hasConflict) {
                  storeTeacher[i][day][period] = teacher;
                  storeSubject[i][day][period] = subject;
                  foundNonConflicting = true;
                }
              }
              
              // If we couldn't find a non-conflicting assignment, just use a random one
              if (!foundNonConflicting) {
                const index = Math.floor(Math.random() * (this.Teacher.length || 10));
                storeTeacher[i][day][period] = this.Teacher[index] || `Teacher ${index + 1}`;
                storeSubject[i][day][period] = this.Subject[index] || `Subject ${index + 1}`;
              }
              
              // Set the timetable entry without time labels
              timeTable[i][day][period] = `${storeSubject[i][day][period]}\n${storeTeacher[i][day][period]}`;
            }
          }
        }
      }
      
      console.log("Timetable generation complete");
      return timeTable;
    } catch (error) {
      console.error("Error generating timetable:", error);
      throw error;
    }
  }
  
  // Function to return the generated timetable
  getTimeTable() {
    return this.data.TimeTable;
  }
  
  // Function to get period timings for the time column
  getPeriodTimings() {
    return this.periodTimes.map(period => 
      period.type === 'Lunch Break' 
        ? 'LUNCH BREAK' 
        : `${period.startTime} - ${period.endTime}`
    );
  }
}

export default TimeTableGenerator2;