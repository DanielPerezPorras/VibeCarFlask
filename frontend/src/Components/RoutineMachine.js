import L, { bind } from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {
  const {coord} = props

  const instance = L.Routing.control({
    waypoints: [
      L.latLng(coord[0], coord[1]),
      L.latLng(coord[2], coord[3])
    ],
    createMarker: function(i, wp){
      return L.marker(wp.latLng)
        .bindPopup(coord[i+4]);
    }
    ,
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;