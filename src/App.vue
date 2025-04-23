<template>
  <div id="app">
    <!-- <map-view></map-view> -->
    <MapGL></MapGL>
    <!-- <BMapGL></BMapGL> -->
  </div>
</template>

<script>
import MapView from './components/MapView.vue'
import MapGL from './components/MapGL.vue'
import BMapGL from './components/BMapGL.vue'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    MapView,
    // eslint-disable-next-line vue/no-unused-components
    MapGL,
    // eslint-disable-next-line vue/no-unused-components
    BMapGL
  },
}
</script>

<style>
body {
  margin: 0;
}
</style>
