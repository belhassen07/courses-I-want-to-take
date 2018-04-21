let svg = d3.select("svg");
const height = 500;
const width = 1200;
const margin = {top: 50, right: 150, bottom:50, left: 50}
svg.attr("height", height)
   .attr("width", width);

d3.csv("data.csv", (courses) => {
  let durationSum = 0;
  courses.forEach(course => {
    course.duration = parseInt(course.duration);
    durationSum += parseInt(course.duration)
  });
  let averageDuration = durationSum / courses.length;
  let yExtent  = d3.extent(courses, course => course.duration );

  let yScale  = d3.scaleLinear().domain(yExtent).range([height - margin.top ,margin.bottom]);
  let radiusScale = d3.scaleLog().domain(yExtent).range([0,100]);
  let xScale = d3.scaleLinear().domain([0, courses.length]).range([margin.left, width - margin.right ]);
  let opacityScale = d3.scaleLog().domain(yExtent).range([0,1]);
  let fontScale = d3.scaleLinear().domain(yExtent).range([10, 20])
  svg.selectAll("circle")
  .data(courses)
  .enter()
  .append("g")
  .append("circle")
  .attr("cx", (course) => xScale(parseInt(course.number)) )
  .attr("cy", (course) => yScale(course.duration) + radiusScale(course.duration) / 2)
  .attr("r", course => radiusScale(course.duration))
  .attr("fill", (course) => {
    console.log(course.duration)
    if(course.duration < averageDuration ){
      return "#55efc4"
    }
    else if(course.duration < averageDuration + 60){
      return "#fab1a0"
    }
    else{
      return "#d63031"
    }
  })
  .attr("opacity", (course) => opacityScale(course.duration))
  // .on("mouseover", function(){
  //   d3.select(this).attr("r", d3.select(this).attr("r") * 1.1 )
  //  })
  //  .on("mouseout", function(){
  //   d3.select(this).attr("r", d3.select(this).attr("r") / 1.1 )
  //  })
 
  //adding texts

  svg.selectAll("text")
  .data(courses)
  .enter()
  .append("text")
  .attr("x", (course) => xScale(parseInt(course.number)) - radiusScale(course.duration) / 2 )
  .attr("y", (course) => yScale(course.duration) + radiusScale(course.duration) / 2)
  .attr("opacity", 0)
  .attr("fill", "#2d3436")
  .text(course => course.name)
  .attr("font-size", course =>  fontScale(course.duration))
  
  let orderedCourses = courses.sort((a, b) =>  parseInt(a.number) - parseInt(b.number));
  d3.select("ol")
  .selectAll("li")
  .data(orderedCourses )
  .enter()
  .append("li")
  .append("a")
  .attr("href", (course) => course.url)
  .text(course => `${course.name} ( ${Math.floor(course.duration / 60) } hours, ${course.duration % 60} min )`)

 
});

