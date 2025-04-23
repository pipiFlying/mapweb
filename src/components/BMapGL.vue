<template>
  <div style="width: 100%; height: 500px">
    <bmap-gl
      :center="{ lng: 116.404, lat: 39.915 }"
      :zoom="15"
      style="width: 100%; height: 100%"
    >
      <bmap-gl-marker
        :position="{ lng: 116.404, lat: 39.915 }"
      ></bmap-gl-marker>
    </bmap-gl>
  </div>
</template>
<script>
export default {
  name: 'BMapGL',
  data() {
    return {
      center: {lng: 116.404, lat: 39.915},
      zoom: 15,
      markerPosition: {lng: 116.404, lat: 39.915}
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleMapReady({ BMapGL, map }) {
      console.log('地图加载完成', map)
      // 可以在这里访问原生BMapGL对象和地图实例
    }
  }
}
</script>

<style>
.map-container {
  width: 100%;
  height: 500px;
}
.map {
  width: 100%;
  height: 100%;
}
</style>