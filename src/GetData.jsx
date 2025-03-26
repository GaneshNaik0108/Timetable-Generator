// GetData.js - Equivalent of the Java GetData class

// Static properties with default values
// Using variables instead of static class properties
let Title = "";
let NoTeacher = 0;
let NoSubjects = 0;
let NoDivision = 0;
let NoBreaks = 0;

// Initialize TimeTable as an empty array, will be set to proper dimensions when needed
let TimeTable = [];

// Initialize TotalTeacher and TotalSubject as empty arrays
let TotalTeacher = [];
let TotalSubject = [];

// Function to update TimeTable dimensions based on NoDivision
const updateTimeTableDimensions = () => {
  TimeTable = Array(NoDivision).fill().map(() => 
    Array(7).fill().map(() => Array(8).fill(""))
  );
};

// Method to get title information
const getInfo = (s) => {
  if (typeof s === "string") {
    // String version of getInfo
    Title = s;
  } else if (arguments.length === 3) {
    // Integer version of getInfo with 3 parameters
    const [a, c, d] = arguments;
    NoTeacher = a;
    NoDivision = c;
    NoBreaks = d;
    
    // Update dimensions and initialize arrays to proper sizes
    updateTimeTableDimensions();
    TotalTeacher = Array(NoTeacher).fill("");
    TotalSubject = Array(NoTeacher).fill("");
  }
};

// All return methods
const GiveBreaksdata = () => {
  return NoBreaks;
};

const Teachersdata = () => {
  return NoTeacher;
};

const Subjectdata = () => {
  return NoTeacher;
};

const Divisiondata = () => {
  return NoDivision;
};

const Titledata = () => {
  return Title;
};

const TotalTeacherData = () => {
  return TotalTeacher;
};

const TotalSubjectData = () => {
  return TotalSubject;
};

// Export all properties and methods
export default {
  // Properties (with getters and setters to mimic static properties)
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
  updateTimeTableDimensions
};