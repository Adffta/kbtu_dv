async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yMinimum = (d) => d.temperatureMin;
    const yMaximum = (d) => d.temperatureHigh;
    // got data for highest temperature

    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yTempLowScaler = d3.scaleLinear()
        .domain(d3.extent(data,yMinimum))
        .range([dimension.boundedHeight, 50]);

    const yTempHighScaler = d3.scaleLinear()
        .domain(d3.extent(data,yMaximum))
        .range([dimension.boundedHeight, 50]);
    // added scaler for highest temperature

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineMinGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yTempLowScaler(yMinimum(d)));

    var lineMaxGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yTempHighScaler(yMaximum(d)));
    // created generator for max temp line

    bounded.append("path")
        .attr("d",lineMinGenerator(data))
        .attr("transform","translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","blue")

    bounded.append("path")
        .attr("d",lineMaxGenerator(data))
        .attr("transform","translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","red")

    const calibration = dimension.boundedHeight + 10
    // added calibration for good-looking

    var x_axis = d3.axisBottom()
        .scale(xScaler);

    var y_axis = d3.axisLeft()
        .scale(yTempLowScaler);
    // defined where axis should be and how to scale

    y_axis.tickFormat( (d,i) => d + "F")

    bounded.append("g")
        .attr("transform", "translate(100, " + calibration + ")")
        .call(x_axis);

    bounded.append("g")
        .attr("transform", "translate(100, 10)")
        .call(y_axis);
    // added some visuals like "F" for temperature

    bounded.append('text')
        .attr('x', dimension.width/2 + 10)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .style('font-size', 20)
        .text('Temperature High Line (red) and Temperature Low Line (blue) in terms of time');
    // added label text on top
}

buildPlot();