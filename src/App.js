import React from 'react'
import { GoogleMap, 
  useLoadScript, 
  Marker,
  InfoWindow
} from "@react-google-maps/api"; 
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";
import "@reach/combobox/styles.css"
import mapStyles from './mapStyles';
import "./index.css"
require('dotenv').config()


// Constants
const libraries = ["places"]
const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
}
// Center of the map (Currently: Chicago)
const center = {
  lat: 41.8781,
  lng: -87.6298,
}
// Styles from snazzy maps
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
}


function App() {
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);

  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <h1>
        Golf Courses{" "} 
        <span role="img" aria-label="golf-hole">
          ⛳
        </span>
      </h1>
      <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        zoom={8}
        center={center}
        options={options}
        onClick={(event) => {
          setMarkers(current => [
            ...current, 
            {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
              time: new Date(),
            },
          ]);
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: "/pin.png",
              scaledSize: new window.google.maps.Size(30,30),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15,30),
            }}
          />
        ))};
      </GoogleMap>
    </div>
  );
}



export default App;
