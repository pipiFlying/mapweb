<template>
  <div id="app">
    <baidu-map
      class="map"
      :center="center"
      :zoom="12"
      :tilt="tilt"
      :heading="heading"
      :scroll-wheel-zoom="true"
      @ready="onMapReady"
    >
      <bm-polygon
        v-for="(area, index) in areas"
        :key="index"
        :path="area.path"
        :stroke-color="area.strokeColor || 'blue'"
        :fill-color="area.fillColor || '#aaddff'"
        :stroke-opacity="0.8"
        :fill-opacity="0.5"
        :stroke-weight="2"
        :stroke-style="area.strokeStyle"
      />
    </baidu-map>
  </div>
</template>

<script>
import { machangping, shuanglongzutuan, luoweitangzutuan } from '@/json/index'
export default {
  name: 'DrawRegionMap',
  components: {
    
  },
  data() {
    return {
      center: {
        lng: 107.52355584632284,
        lat: 26.660076883968387
      },
      zoom: 18,
      tilt: 45, // 倾斜角度
      heading: 0, // 旋转角度
      areas: [
        {
          path: machangping,
          strokeColor: 'yellow',
          fillColor: '#ccffcc',
          strokeStyle: "dashed"
        },
        {
          path: shuanglongzutuan,
          strokeColor: 'yellow',
          fillColor: '#ccffcc',
          strokeStyle: "dashed"
        },
        {
          path: luoweitangzutuan,
          strokeColor: 'yellow',
          fillColor: '#ccffcc',
          strokeStyle: "dashed"
        }
      ]
    }
  },
  methods: {
    onMapReady({ BMap, map }) {
      console.log('地图加载完成');
      map.setMapStyleV2({     
        styleId: 'd674a6396fd8c655b5b0d08117400fa4'
      });
      map.disableScrollWheelZoom(); // 禁用默认滚轮缩放

      let lastZoomTime = 0;
      const throttleDelay = 300; // 节流间隔（单位 ms）
      const zoomStep = 1; // 每次缩放的颗粒度（可以调整为 1、0.5、2 等）

      map.getContainer().addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastZoomTime < throttleDelay) return;

        const delta = e.deltaY || e.wheelDelta;
        const zoom = map.getZoom();
        let newZoom;

        // 上滚：放大
        if (delta < 0) {
          newZoom = zoom + zoomStep;
        }
        // 下滚：缩小
        else {
          newZoom = zoom - zoomStep;
        }

        // 设置最小和最大缩放级别（例如最小3，最大19）
        if (newZoom >= 3 && newZoom <= 50) {
          map.setZoom(newZoom);
        }

        lastZoomTime = now;
      });
      // 加载 DrawingManager 插件
      // eslint-disable-next-line no-undef
      const drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: true,
        enableDrawingTool: true,
        drawingToolOptions: {
          // eslint-disable-next-line no-undef
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          offset: new BMap.Size(10, 10),
        },
        polygonOptions: {
          strokeColor: "red",
          fillColor: "red",
          strokeWeight: 2,
          strokeOpacity: 1,
          fillOpacity: 0.5,
        }
      });

      // 监听绘制完成事件
      drawingManager.addEventListener('overlaycomplete', (e) => {
        console.log(e, '绘制完成88888888');
        if (e.drawingMode === 'polyline') {
          const points = e.overlay.getPath().map(p => ({
            lng: p.lng,
            lat: p.lat
          }));
          console.log('绘制区域点数组:', points);
          this.saveArrayToFile(points)
          alert('区域点数组已打印到控制台');
        }
      });
    },
    saveArrayToFile(arr) {
      const data = JSON.stringify(arr, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'myArrayData.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
</style>
