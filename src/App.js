/*
 * Created using this tutorial: https://www.youtube.com/watch?v=WZcxJGmLbSo
 */

import React from "react";
// Package for Google Maps
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import Search from "./Search";
import Locate from "./Locate";
import "./index.css";
import * as golfCourseData from "./data/golfCourseData.json";
require("dotenv").config();

// Constants
const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
// Center of the map (Currently: Chicago)
const center = {
  lat: golfCourseData.cities.Chicago.lat,
  lng: golfCourseData.cities.Chicago.lng,
};
// Styles from snazzy maps
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

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

      <SearchBox panTo={panTo} />
      <LocateButton panTo={panTo} />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {golfCourseData.courses.map((golfCourse) => (
          <Marker
            key={golfCourse.id}
            position={{
              lat: golfCourse.lat,
              lng: golfCourse.lng,
            }}
            icon={{
              url: "/pin.png",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 30),
            }}
            onClick={() => {
              setSelected(golfCourse);
            }}
          />
        ))}
        ;
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h4>{selected.name}</h4>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function SearchBox({ panTo }) {
  return Search({ panTo });
}

function LocateButton({ panTo }) {
  return Locate({ panTo });
}

export default App;
