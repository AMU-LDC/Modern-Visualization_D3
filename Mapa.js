d3.json('https://raw.githubusercontent.com/AMU-LDC/Testing/master/practica.json')
  .then((featureCollection) => {
    drawMap(featureCollection);
  });

function drawMap(featureCollection) {
  const svg = d3.select('#mapaAirbnb')
    .append('svg');
  
  const width = 750;
  const height = 750;
  svg.attr('width', width)
    .attr('height', height);

  const center = d3.geoCentroid(featureCollection);
  const projection =  d3.geoMercator()
    .fitSize([width, height], featureCollection)
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
   
  subunitsPath.on('click', function clickSubunit(d) {
    const data = d.properties.avgbedrooms;
    console.log(data);
    const width = 500;
    const height = 500;
      
    const scaleX = d3.scaleLinear()
      .domain([0,5])
      .range([0, width - 20]);  
      
    const scaleY = d3.scaleLinear()
      .domain([0,1000])
      .range([height, 20]);
    
    const svg = d3.select('#graficaAirbnb')
      .append('svg');
    
    svg.attr('width', width)
      .attr('height', height);
    
    const group = svg.selectAll('g')
      .data(data)
    
    group.attr('transform', (d) => {
      const coordX = scaleX([0,1,2,3,4]);
      const coordY = scaleY(data);
    });
      
    const xAxis = d3.axisBottom(scaleX);
      
    const groupAxisX = svg.append('g');
      
    groupAxisX
        .attr('transform', `translate(0, ${height - 20})`)
        .call(xAxis);
      
    const yAxis = d3.axisRight(scaleY);
      
    const groupAxisY = svg.append('g');
      
    groupAxisY
        .call(yAxis);
    
        
  })

}

