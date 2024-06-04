// const timeAvailability = Object.entries({{monday:['14:00','16:00']},{tuesday:['14:00','16:00']}}).map((keys,values)=>{

// })
const dip = Object.entries({
  monday: ["14:00", "16:00"],
  tuesday: ["14:00", "16:00"],
}).map((key) => `${key[0]}: ${key[1].join("-")}`);
console.log(dip.join(", "));
