async function buildPlot() {
    const data = await d3.json("umap.json");
    const dateParser = d3.timeParse("%%d-%m-Y");

    const groupedData = await d3.json("group.json");
    const dateParserGR = d3.timeParse("%%m-Y");

    const yAccessor = (d) => d.y;
    const xAccessor = (d) => dateParser(d.date_publ);

    const yGRAccessor = (d) => d.y;
    const xGRAccessor = (d) => dateParser(d.date_publ);

    var dimension = {
        width: window.innerWidth*0.9,
        height: 600,
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

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,50]);
    te = groupedData
    //Scaler added
    const tempHighScaler = d3.scaleLinear()
        .domain(d3.extent(data,tempHighAccessor))
        .range([dimension.boundedHeight,50]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);
    re = dateParserGR
    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => tempHighScaler(yAccessor(d)));


    var xAxis = d3.axisBottom()
        .scale(xScaler);

    var yAxis = d3.axisLeft()
        .scale(tempHighScaler);

    yAxis.tickFormat( (d,i) => d + "F")
}

function getRandomData(ordinal = false) {

    const NGROUPS = 5,
        MAXLINES = 15,
        MAXSEGMENTS = 60,
        MAXCATEGORIES = 15,
        MINTIME = new Date(2007,2,21);

    const nCategories = Math.ceil(Math.random()*MAXCATEGORIES),
        categoryLabels = ['solar,dust,ray', 'acceleration,pioneer,gravitational', 'space,system,control', 'coronal,cmes,cme', 'dust,pioneer,ray'];

    return [...Array(NGROUPS).keys()].map(i => ({
        group: 'group' + (i+1),
        data: getGroupData()
    }));

    //

    function getGroupData() {

        return [...Array(Math.ceil(Math.random()*MAXLINES)).keys()].map(i => ({
            label: 'label' + (i+1),
            data: getSegmentsData()
        }));

        //

        function getSegmentsData() {
            const nSegments = Math.ceil(Math.random()*MAXSEGMENTS),
                segMaxLength = Math.round(((new Date())-MINTIME)/nSegments);
            let runLength = MINTIME;

            return [...Array(nSegments).keys()].map(i => {
                const tDivide = [Math.random(), Math.random()].sort(),
                    start = new Date(runLength.getTime() + tDivide[0]*segMaxLength),
                    end = new Date(runLength.getTime() + tDivide[1]*segMaxLength);

                runLength = new Date(runLength.getTime() + segMaxLength);

                return {
                    timeRange: [start, end],
                    val: ordinal ? categoryLabels[Math.ceil(Math.random()*nCategories)] : Math.random()
                    //labelVal: is optional - only displayed in the labels
                };
            });

        }
    }
}