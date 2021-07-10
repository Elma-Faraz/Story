
exports.getDate = function() {
    
  let toDay = new Date(); //it gives the current date. Its a javscript function
  let currentDay = toDay.getDay(); //to get the date we need this getDay() function
  let options = {       //to get the full format of date like: Sunday,July4 we use this 
      weekday: "long",
       day: "numeric",
       month: "long"
  };
  
  let CurrentDayName = toDay.toLocaleDateString("en-US", options);  ;//to get above options to show on server we need this function
  
  return(CurrentDayName);
}; 