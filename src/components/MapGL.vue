<template>
  <div class="map-container">
    <div class="map-container-GL" ref="mapGL"></div>
    <div class="map-container-btns">
      <div class="btn-qy" @click="zoomToFQAreas">福泉园区</div>
      <div class="btn-item" v-for="(area, index) in FQAreas" :key="index" @click="zoomToArea(index)">{{ area.name }}</div>
    </div>
  </div>
</template>

<script>
import { machangping, shuanglongzutuan, luoweitangzutuan } from '@/json/index'
export default {
  name: 'MapGL',
  components: {
    
  },
  data() {
    return {
      mapOptions: {
        center: { lng: 107.52355584632284, lat: 26.660076883968387 },
        zoom: 13,
        tilt: 60,
        heading: 0,
        styleId: 'd674a6396fd8c655b5b0d08117400fa4'
      },
      map: null,
      BMapGL: null,
      FQAreas: [
        {
          name: '区块一',
          path: machangping,
          strokeColor: '#5679ea',
          fillColor: '#5679ea',
          strokeStyle: "dashed",
          polygon: null
        },
        {
          name: '区块二',
          path: shuanglongzutuan,
          strokeColor: '#5679ea',
          fillColor: '#5679ea',
          strokeStyle: "dashed",
          polygon: null
        },
        {
          name: '区块三',
          path: luoweitangzutuan,
          strokeColor: '#5679ea',
          fillColor: '#5679ea',
          strokeStyle: "dashed",
          polygon: null
        }
      ]
    }
  },
  mounted() {
    this.loadBMapGL()
  },
  methods: {
    loadBMapGL() {
      const script = document.createElement('script')
      script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${process.env.VUE_APP_BMAK}&callback=onMapReady`
      document.body.appendChild(script)
      window.onMapReady = () => { this.onMapReady() }
    },
    onMapReady() {
      // eslint-disable-next-line no-undef
      if (BMapGL) this.BMapGL = BMapGL
      this.map = new this.BMapGL.Map(this.$refs.mapGL)
      this.map.centerAndZoom(new this.BMapGL.Point(this.mapOptions.center.lng, this.mapOptions.center.lat), this.mapOptions.zoom)
      this.map.setTilt(this.mapOptions.tilt)
      this.map.setMapStyleV2({ styleId: this.mapOptions.styleId })
      this.map.enableScrollWheelZoom()
      this.setAreas()
    },
    setAreas() {
      this.FQAreas.forEach(area => {
        const points = area.path.map(coord => new this.BMapGL.Point(coord.lng, coord.lat))
        area.polygon = new this.BMapGL.Polygon(points, {
          strokeColor: area.strokeColor,
          strokeWeight: 2,
          strokeOpacity: 0.8,
          fillColor: area.fillColor,
          fillOpacity: 0.2,
          strokeStyle: area.strokeStyle,
        })
        const prism = new this.BMapGL.Prism(points, 500, {
          topFillColor: area.fillColor,
          topFillOpacity: 0.5,
          sideFillColor: area.strokeColor,
          sideFillOpacity: 0.5
        })
        this.map.addOverlay(prism)

        const center = this.calculateCenter(points)
        this.creatDOM(center, area)

        this.map.addOverlay(area.polygon)
      })
    },
    calculateCenter(points) {
      const lngs = points.map(p => p.lng)
      const lats = points.map(p => p.lat)
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      return new this.BMapGL.Point((minLng + maxLng) / 2, (minLat + maxLat) / 2)
    },
    zoomToFQAreas() {
      const points = this.FQAreas.flatMap(area => 
        area.path.map(coord => new this.BMapGL.Point(coord.lng, coord.lat))
      )
      this.map.setViewport(points)
    },
    zoomToArea(index) {
      const area = this.FQAreas[index]
      const points = area.path.map(coord => new this.BMapGL.Point(coord.lng, coord.lat))
      const center = this.calculateCenter(points)
      // 设置动画参数
      const viewport = {
        center: center,
        zoom: 15,
        tilt: this.mapOptions.tilt,
      }
      const options = {
        duration: 1000,
        delay: 0,
        // eslint-disable-next-line no-undef
        type: BMAP_ANIMATION_BOUNCE // 弹跳动画效果
      }
      this.map.setViewport(viewport, options)
    },
    creatDOM(point, area) {
      function CustomOverlay(point) {
        this._point = point
      }
      CustomOverlay.prototype = new this.BMapGL.Overlay()

      CustomOverlay.prototype.initialize = function(map) {
        this._map = map
        const container = document.createElement('div')
        container.className = 'custom-overlay'
        container.innerHTML = `
          <div class="custom-overlay-box">
            <div class="custom-overlay-title">${area.name}</div>
          </div>`
        const arrow = document.createElement('div')
        container.appendChild(arrow)
        arrow.className = 'custom-arrow'
        this._div = container
        map.getPanes().labelPane.appendChild(container)
        return container
      }
      CustomOverlay.prototype.draw = function() {
        const pixel = this._map.pointToOverlayPixel(this._point)
        const div = this._div
        const width = div.offsetWidth
        const height = div.offsetHeight
        div.style.left = pixel.x - width / 2 + "px"
        div.style.top = pixel.y - 2 * height + "px"  // 向上偏移
      }
      const customOverlay = new CustomOverlay(point)
      this.map.addOverlay(customOverlay)
    }
  },
  beforeDestroy() {
    this.map && this.map.destroy()
    this.BMapGL && (this.BMapGL = null)
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  &-GL {
    width: 100%;
    height: 100%;
  }
  &-btns {
    position: absolute;
    z-index: 1000;
    right: W(40);
    bottom: H(50);
    color: $font-text-color-light;
    .btn-qy {
      background: #6de6f8;
      text-align: center;
      margin: H(20) 0;
      padding: H(10);
      border-radius: W(8);
      font-size: W(20);
      &:hover {
        cursor: pointer;
      }
    }
    .btn-item {
      text-align: center;
      margin: H(20) 0;
      padding: H(10);
      min-width: W(100);
      background: url('@/assets/btn-bg.png');
      background-size: 100% 100%;
      font-size: W(16);
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.custom-overlay {
  position: absolute;
  bottom: 0;
  height: H(60);
  width: W(220);
  font-size: W(16);
  background-color: rgba(0, 60, 120, 0.6);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.7);
  border-radius: W(8);
  color: $font-text-color-light;
  &-title {
    padding: W(10);
    text-align: center;
  }
}
.custom-arrow {
  width: 0;
  height: 0;
  margin: 0 auto;
  margin-top: W(8);
  border-left: W(16) solid transparent;
  border-right: W(16) solid transparent;
  border-top: W(16) solid rgba(0, 60, 120, 0.6);
}
</style>
