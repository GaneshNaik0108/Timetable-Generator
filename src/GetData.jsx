// GetData.js - Equivalent of the Java GetData class with enhanced timing support

// Static properties with default values
// Using variables instead of static class properties
let Title = "";
let NoTeacher = 0;
let NoSubjects = 0;
let NoDivision = 0;
let NoBreaks = 0;
let StartTime = "";
let EndTime = "";
let LectureDuration = 45; // Default to 45 minutes if not specified

// Initialize TimeTable as an empty array, will be set to proper dimensions when needed
let TimeTable = [];

// Initialize TotalTeacher and TotalSubject as empty arrays
let TotalTeacher = [];
let TotalSubject = [];

// Function to update TimeTable dimensions based on NoDivision
const updateTimeTableDimensions = () => {
  // Ensure NoDivision is at least 1 to prevent errors
  const safeDivisions = Math.max(1, NoDivision);
  
  TimeTable = Array(safeDivisions).fill().map(() => 
    Array(7).fill().map(() => Array(8).fill(""))
  );
};

// Method to get title information with enhanced flexibility
const getInfo = (...args) => {
  if (args.length === 1 && typeof args[0] === "string") {
    // String version of getInfo (set title)
    Title = args[0];
  } else if (args.length >= 3) {
    // Integer version of getInfo with multiple parameters
    const [a, c, d, startTime = "", lectureDuration = 45, breakDuration = 10] = args;
    
    NoTeacher = a;
    NoDivision = c;
    NoBreaks = d;
    StartTime = startTime;
    LectureDuration = lectureDuration;
    
    // Ensure lecture duration is a positive number
    LectureDuration = Math.max(15, Math.min(90, LectureDuration || 45));
    
    // Update dimensions and initialize arrays to proper sizes
    updateTimeTableDimensions();
    
    // Initialize teacher and subject arrays
    TotalTeacher = Array(NoTeacher).fill("");
    TotalSubject = Array(NoTeacher).fill("");
    
    // Calculate end time based on start time and lecture duration
    if (StartTime) {
      const [startHour, startMinute] = StartTime.split(':').map(Number);
      const totalMinutes = startMinute + (7 * (LectureDuration + (NoBreaks || 10)) + 30); // 7 periods with breaks and lunch
      
      const endHour = Math.floor((startHour * 60 + totalMinutes) / 60);
      const endMinute = (startHour * 60 + totalMinutes) % 60;
      
      EndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    }
  }
};

// Getter methods for all data
const GiveBreaksdata = () => NoBreaks;
const Teachersdata = () => NoTeacher;
const Subjectdata = () => NoTeacher;
const Divisiondata = () => NoDivision;
const Titledata = () => Title;
const TotalTeacherData = () => TotalTeacher;
const TotalSubjectData = () => TotalSubject;

// New getter methods for additional fields
const getStartTime = () => StartTime;
const getEndTime = () => EndTime;
const getLectureDuration = () => LectureDuration;

// Export all properties and methods
export default {
  // Properties with getters and setters
  get Title() { return Title; },
  set Title(value) { Title = value; },
  
  get NoTeacher() { return NoTeacher; },
  set NoTeacher(value) { NoTeacher = value; },
  
  get NoSubjects() { return NoSubjects; },
  set NoSubjects(value) { NoSubjects = value; },
  
  get NoDivision() { return NoDivision; },
  set NoDivision(value) { 
    NoDivision = value;
    updateTimeTableDimensions();
  },
  
  get NoBreaks() { return NoBreaks; },
  set NoBreaks(value) { NoBreaks = value; },

  // New time-related properties
  get StartTime() { return StartTime; },
  set StartTime(value) { 
    StartTime = value;
    // Optionally recalculate end time when start time changes
    if (StartTime && LectureDuration) {
      const [startHour, startMinute] = StartTime.split(':').map(Number);
      const totalMinutes = startMinute + (7 * (LectureDuration + (NoBreaks || 10)) + 30);
      
      const endHour = Math.floor((startHour * 60 + totalMinutes) / 60);
      const endMinute = (startHour * 60 + totalMinutes) % 60;
      
      EndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    }
  },
  
  get EndTime() { return EndTime; },
  set EndTime(value) { EndTime = value; },
  
  get LectureDuration() { return LectureDuration; },
  set LectureDuration(value) { 
    // Ensure lecture duration is between 15 and 90 minutes
    LectureDuration = Math.max(15, Math.min(90, value || 45));
    
    // Recalculate end time if start time exists
    if (StartTime) {
      const [startHour, startMinute] = StartTime.split(':').map(Number);
      const totalMinutes = startMinute + (7 * (LectureDuration + (NoBreaks || 10)) + 30);
      
      const endHour = Math.floor((startHour * 60 + totalMinutes) / 60);
      const endMinute = (startHour * 60 + totalMinutes) % 60;
      
      EndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    }
  },
  
  get TimeTable() { return TimeTable; },
  set TimeTable(value) { TimeTable = value; },
  
  get TotalTeacher() { return TotalTeacher; },
  set TotalTeacher(value) { TotalTeacher = value; },
  
  get TotalSubject() { return TotalSubject; },
  set TotalSubject(value) { TotalSubject = value; },
  
  // Methods
  getInfo,
  GiveBreaksdata,
  Teachersdata,
  Subjectdata,
  Divisiondata,
  Titledata,
  TotalTeacherData,
  TotalSubjectData,
  updateTimeTableDimensions,

  // New getter methods
  getStartTime,
  getEndTime,
  getLectureDuration
};