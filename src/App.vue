<template>
  <div id="app" >
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        
          <img class="my-1 ml-3" src="covid.png" width="70px" height="auto">
          <p class="ml-3 my-3 font-weight-bold text-light">DATA APP</p>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
      </nav>

    <div class="container my-4">
      <h1 class=" my-4 text-center">台灣疫情報告</h1>
      <div class="row">
        <div class="col-4 text-center ">
          <button @click="changeTwnTitle(twnTotals)" class="btn btn-info m-2 h-75 active">台灣總確診數 : {{titleTotal}}</button>
        </div>
        <div class="col-4 text-center">
          <button @click="changeTwnTitle(twnVac)" class="btn btn-success m-2 h-75 active">疫苗接種數量 : {{titleVac}}</button>
          
        </div>
        <div class="col-4 text-center">
          <button @click="changeTwnTitle(twnDeath)" class="btn btn-danger m-2 h-75 active">總死亡人數 : {{titleDeath}}</button>
          
        </div>
      </div>
    </div>

    <div class="container my-4">
      <line-chart v-if="loaded" :chartData="twnchartData" :options="options"></line-chart>
    </div>
  
    <div class="container mt-5">
      <h1 class=" my-4 text-center">各縣市疫情報告</h1>
      <div class="d-flex justify-content-center align-items-center">
      <select v-model="cities" @change="onchange" class="custom-select custom-select-lg mx-3 my-3 w-25">
        <option v-for="(city,i) in arrcities" :key="city" :value="city" :id="i">{{city}}</option>
      </select>

      <select v-show="getcity == area.id" v-model="cityarea" v-for="area in arrareas" :key="area.id" class="custom-select custom-select-lg mx-3 my-3 w-25">
        <option v-for="(smarea,i) in area.area" :key="i" :value="smarea">{{smarea}}</option>
      </select>

      <button @click="update()" class="btn btn-secondary m-1 h-50">Search</button>
      </div>

      <bar-chart v-if="loaded" :chartData="chartData" :options="options"></bar-chart>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BarChart from "./components/chart1"
import LineChart from "./components/chart2"

export default {
  components:{
    LineChart,
    BarChart
  },
  data(){
    return {
      loaded:true,
      cities:'台北市',
      cityarea:'全區',
      getcity:0,
      //縣市陣列
      arrcities:[],
      arrareas:[],
      //
      filtData:[],
      fullData:[],
      dateData:[],
      totalsData:[],
      addData:null,
      //api 2
      titleTotal:'',
      titleVac:'',
      titleDeath:'',
      twnData:[],
      twnDate:[],
      twnTotals:[],
      twnDeath:[],
      twnVac:[],
      
      // prop for chart
      options:{
        responsive: true,
        maintainAspectRatio: false,
        scales:{
          beginAtZero:true,
          xAxes: [{
          // type: 'time',
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            maxRotation:0
          }
          }]
        } 
      },
      twnchartData:{
        labels:[],
        datasets:[{
          label:'台灣確診總數',
          backgroundColor: 'rgb(16, 117, 124,0.5)',
          data:[],
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent'
        }]
      },
      chartData:{
        labels:[],
        datasets:[{
          label:'每日增加確診人數',
          data:[],
          backgroundColor:'rgb(241, 163, 16,0.5)'
        }]
      }
    }
  },
  async created(){
    axios.get("/api/api/covid19?CK=covid-19@nchc.org.tw&querydata=5002&limited=全部縣市").then((res)=>{
     
        res.data.forEach(d => {
        this.fullData.push({date:d.a01,city:d.a02,area:d.a03,add:d.a04,total:d.a05})
         })
        let allcity = this.fullData.map(d=>d.city )
        var result = new Set(allcity)
        this.arrcities = [...result]
        this.arrcities = this.arrcities.filter(d => {return d != "境外移入"})

        this.arrcities.forEach((d,i)=>{
          this.getAreaArr(d,i)
        })
        this.update()
        
        
    })

    //---------------------------------------------------------------
    axios.get("/api/api/covid19?CK=covid-19@nchc.org.tw&querydata=4001&limited=TWN").then((res)=>{
      res.data.forEach(d=>{
        this.twnData.push({date:d.a04,twntotal:d.a05,death:d.a08,vac:d.a21})
      })
      this.titleTotal = this.twnData[0].twntotal
      this.titleVac = this.twnData[0].vac
      this.titleDeath = this.twnData[0].death
      
      this.updatetwn()
    })

    
      

    },
    methods:{
      update(){
        this.filtData = this.fullData.filter(d =>{return  d.area ===this.cityarea && d.city === this.cities})
        this.addData = this.filtData.map(d => d.add).reverse()
        this.dateData = this.filtData.map(d =>d.date).reverse()

        this.chartData.labels = this.dateData
        this.chartData.datasets[0].data =this.addData
        this.chartData = {...this.chartData}
      },
      updatetwn(){
        this.twnDate = this.twnData.map(d=>d.date).reverse()
        this.twnTotals = this.twnData.map(d=>d.twntotal).reverse()
        this.twnDeath = this.twnData.map(d=>d.death).reverse()
        this.twnVac = this.twnData.map(d=>d.vac).reverse()

        this.twnchartData.labels = this.twnDate
        this.twnchartData.datasets[0].data = this.twnTotals
        this.twnchartData = {...this.twnchartData }
      },
      changeTwnTitle(d){
        if( d == this.twnVac){
          this.twnchartData.datasets[0].data = d
          this.twnchartData.datasets[0].label = "疫苗接種數量"
          this.twnchartData.datasets[0].backgroundColor = 'rgb(0, 143, 0,0.5)'
        }else if (d == this.twnDeath){
          this.twnchartData.datasets[0].data = d
          this.twnchartData.datasets[0].label = "總死亡人數"
          this.twnchartData.datasets[0].backgroundColor = 'rgb(204, 0, 0,0.5)'
        }else{
          this.twnchartData.datasets[0].data = this.twnTotals
          this.twnchartData.datasets[0].label = "台灣總確診數"
          this.twnchartData.datasets[0].backgroundColor = 'rgb(16, 117, 124,0.5)'
        }
        this.twnchartData = {...this.twnchartData }
        
      },
      
      getAreaArr(c,i){
        const allarea = this.fullData.filter(d =>{return d.city === c})
        const tcity = allarea.map(d=>d.area)
        var tresult =new Set(tcity)
        // console.log([...tresult])
        this.arrareas.push({id:i,area:[...tresult]})
      },
      onchange(e){
        this.getcity = e.target.selectedIndex
      }
      
     
    }
}
</script>

<style>

</style>
