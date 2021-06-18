<template>
  <div class="search-state">
    <div class="auto-complete">
      <h1 class="title">Search for a State</h1>
      <input class="input" type="text" v-model="inputString" @input="onChange" placeholder="States" />
      
      <div class="dropdown-menu" v-show="isOpen">
        <div class="dropdown-item" v-for="(state, index) in states" v-bind:key="state" @click="onClick(index)">
          {{ state }}
        </div>
      </div>
    </div>
    <div id="map" />
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  import { stateCoords } from "../../statesCoords"

  export default {
    data: function () {
      return {
        inputString: '',
        isOpen: false,
        states: [],
        selectedState: '',
        map: null,
        mapCenter: { lat:39.8097, lng:-98.556 },
        selectedStatePolygon: null
      }
    },
    mounted() {
      this.initMap();
    },
    methods: {
      // initialize the map
      initMap() {
        this.map = new window.google.maps.Map(
          document.getElementById('map'), {
            center: this.mapCenter,
            zoom: 4,
          }
        )
      },
      onChange() {
        this.isOpen = this.inputString === '' ? false : true;
      },
      onClick(index) {
        this.isOpen = false;
        this.inputString = this.states[index];
        this.selectedState = this.states[index];

        // set the format of the boundaries
        const stateWithCoord = stateCoords.filter(stateCoord => stateCoord[0] === this.selectedState);
        const selectedStateCoord = stateWithCoord[0][1].map(e => {
          return { "lat": e[0], "lng": e[1] }
        });

        this.updateMapZoomAndCenter();
        this.updateMapPolygons(selectedStateCoord);
      },
      updateMapZoomAndCenter() {
        // adjust the map for different states
        if (this.selectedState === 'Alaska') {
          this.map.setCenter({ lat: 66.16, lng:-153.369 });
          this.map.setZoom(3);
        } else if (this.selectedState === 'Hawaii') {
          this.map.setCenter({ lat: 19.741, lng:-155.844 });
          this.map.setZoom(5);
        } else {
          this.map.setCenter(this.mapCenter);
          this.map.setZoom(4);
        }
      },
      updateMapPolygons(selectedStateCoord) {
        // remove the previous polygon
        if (this.selectedStatePolygon) this.selectedStatePolygon.setMap(null);
        // construct the polygon
        this.selectedStatePolygon = new window.google.maps.Polygon({
          paths: selectedStateCoord,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: this.map
        });
      }
    },
    apollo: {
      states: {
        query: gql`query Query($searchString: String!){
          states(searchString: $searchString)
        }`,
        variables () {
          return {
            searchString: this.inputString,
          }
        },
      },
    },
  }
</script>

<style scoped>
  .search-state {
    margin-left: 2em;
    margin-right: 2em;
  }
  .input {
    background: #fff;
    border: 1px solid #7c7e81;
    border-radius: 3px;
    color: #333;
    font-size: .8em;
    padding: 6px;
    width: 400px;
    height: 20px;
    display: block;
  }

  .input:hover {
    background: #f8f8fa;
  }

  .dropdown-menu {
    position: absolute;
    background-color: #fff;
    width: 200px;
    max-height: 200px;
    border: 1px solid #e7ecf5;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.05);
    overflow: auto;
    z-index: 1;
  }

  .dropdown-item {
    color: black;
    font-size: .7em;
    line-height: 1em;
    padding: 8px;
    display: block;
  }

  .dropdown-item:hover {
    background-color: #e7ecf5;
  }

  #map {
    margin-top: 4em;
    height: 500px;
    width: 100%;
  }
</style>
