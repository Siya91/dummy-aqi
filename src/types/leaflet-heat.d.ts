declare module 'leaflet.heat' {
  import * as L from 'leaflet';

  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  }

  interface HeatLayer extends L.Layer {
    setLatLngs(latlngs: [number, number, number][]): this;
    addLatLng(latlng: [number, number, number]): this;
    setOptions(options: HeatLayerOptions): this;
    redraw(): this;
  }

  // Augment the Leaflet map interface with the heatLayer factory
  module 'leaflet' {
    interface Map {
      // no runtime method — we use L.heatLayer
    }
    function heatLayer(
      latlngs: [number, number, number][],
      options?: HeatLayerOptions
    ): HeatLayer;
  }

  export = L;
}
