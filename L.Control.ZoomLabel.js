L.Control.ZoomLabel = L.Control.extend({
    options: {
        position: 'bottomleft'
    },

    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-zoomlabel');
        L.DomEvent.disableClickPropagation(this._container);
        map.on('zoomend', this._onZoomend, this);
        this._container.innerHTML = map.getZoom();
        return this._container;
    },

    onRemove: function (map) {
        map.off('zoomend', this._onZoomend);
    },

    _onZoomend: function(e) {
        this._container.innerHTML = e.target._zoom;
    }
});

L.control.zoomLabel = function (options) {
    return new L.Control.ZoomLabel(options);
};
