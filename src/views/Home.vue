<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    
    {{test}}
  </div>
</template>

<script>
// import axios from 'axios'
import * as d3 from 'd3'




export default {
  name: 'Home',
  data(){
    return{
      o3:'',
      points:[
        {
          x:200,
          y:100
        }
      ],
      sampleData: [
        { x: 10, y: 80 },
        { x: 70, y: 40 },
        { x: 60, y: 50 },
        { x: 30, y: 100 },
        { x: 90, y: 20 }
      ]
     
    }
  },
  components: {
  
  },
  // mounted(){
  //   axios.get('https://data.epa.gov.tw/api/v1/aqx_p_136?limit=5&api_key=63f9c920-8a1d-45df-ae2d-2620c71da777').then((res)=>{
  //     console.log(res)
  //     this.o3 = res.data.records[0].Concentration
  //   })
  //   },
  mounted(){
    d3.select(".home")
      .append("svg")
      .attr("width",250)
      .attr("height",250)
      .style("border","2px solid grey")
    this.draw()
  },
  computed:{
    xData(){
      return this.sampleData.map((d)=>{return d.x})
    },
    yData(){
      return this.sampleData.map((d)=>{return d.y})
    }
  },
  methods:{
    draw(){
      let xScale = d3
                      .scaleLinear()
                      .domain([0,d3.max(this.xData)])
                      .range([0,200])
      let xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10).tickFormat((d)=>{return d+"哈"})
      let gXaxis = d3
                    .select("svg")
                    .append("g")
                    .attr("transform","translate(30,220)")

      xAxis(gXaxis)

      let yScale = d3
                    .scaleLinear()
                    .domain([0,d3.max(this.yData)])
                    .range([200,0])
      let yAxis = d3.axisLeft(yScale)
      let gYaxis = d3
                    .select("svg")
                    .append("g")
                    .attr("transform","translate(30,20)")
      yAxis(gYaxis)
    }
  }
 
}
</script>
