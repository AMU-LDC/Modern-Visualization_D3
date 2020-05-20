function Dataset(jsondata) {
  console.log(jsondata);
}

d3.json('https://raw.githubusercontent.com/AMU-LDC/Testing/master/practica.json', Dataset)
  .then((featureCollection) => {
    drawMap(featureCollection);

function drawMap(featureCollection) {
  const svg = d3.select('#mapaAirbnb')
    .append('svg');
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  svg.attr('width', width)
    .attr('height', height);

  const center = d3.geoCentroid(featureCollection);
  const projection =  d3.geoMercator()
    .fitSize([width - 50, height - 50], featureCollection)
    .center(center)
    .translate([width/2, height/2])
  
  const pathProjection = d3.geoPath().projection(projection);

  const features = featureCollection.features;
  
  const groupMap = svg.append('g').attr('class', 'map');

  const subunitsPath = groupMap.selectAll('.subunits')
    .data(features)
    .enter()
    .append('path');
  
  subunitsPath.attr('d',(d) => {
    d.opacity = 1;
    return pathProjection(d);
  });

  var color = d3.scaleSequential()
    .domain([1, 128])
    .interpolator(d3.interpolateViridis);

  subunitsPath.attr('fill', (d) => color(d.properties.avgprice));

  subunitsPath
    .on('click', d => drawChart(d.properties.avgbedrooms, d.properties.name))
    
    function drawChart(data, name) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const svg = d3.select('#graficaAirbnb')
        .append('svg')
        .attr('width', width)
        .attr('height', height);  
      
      const color = d3.scaleOrdinal(d3.schemePaired);

      const scaleX = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0,width/2])
        .paddingInner(0.05);  
        
      const scaleY = d3.scaleLinear()
        .domain([(d3.max(data, d => d.total))+2, 0])
        .range([0,height-130]);

      const bars = svg.selectAll('.bar')
        .data(data,function(d) {
          return d.label;
        })
        .enter()
        .append('g');

      bars.append('rect')
        .data(data)
        .attr('class','bar')
        .attr('fill', d => color(d.bedrooms))
        .attr('x', d => scaleX(d.bedrooms) + 40)
        .attr('y', d => scaleY(d.total))
        .attr('width', scaleX.bandwidth())
        .attr('height', d => scaleY(0) - scaleY(d.total))
        
      bars.append('text')
        .text(d => d.total)
        .attr('text-anchor', 'middle')
        .attr('dy', '1.2em')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .attr('fill', 'black')
        .attr('x', d => scaleX(d.bedrooms) + 85)
        .attr('y', d => scaleY(d.total) - 20);
      
      bars.append('text')
        .text(name)
        .attr('x', width - 740)
        .attr('y', height - 610)
        .attr('font-weight', 'bold')
        .attr('font-size', '18px')
        .attr('fill', 'black')
        
      const xAxis = d3.axisBottom(scaleX);
      
      const yAxis = d3.axisLeft(scaleY);
      
      svg
        .append('g')
        .attr('transform', 'translate(40,' + (height-130) + ')')
        .call(xAxis)
      
      svg
        .append('g')
        .attr('transform', 'translate(' + (width-940) + ',-0.5)')
        .call(yAxis)

  }     
}
})