<template>
  <div id="app">
    <!-- <map-view></map-view> -->
    <MapGL></MapGL>
  </div>
</template>

<script>
import MapView from './components/MapView.vue'
import MapGL from './components/MapGL.vue'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    MapView,
    // eslint-disable-next-line vue/no-unused-components
    MapGL,
  },
}
</script>

<style>
body {
  margin: 0;
}
</style>
