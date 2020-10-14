import * as React from "react";

import LocationIcon from "../../assets/pin.svg";
// import i18n react component
import { FormattedMessage } from "react-intl";
// Buffetjs components
import { Text, Padded } from "@buffetjs/core";
// Autocomplete component
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// function to query LatLng and Place id
import { getGeocode, getLatLng } from "use-places-autocomplete";
// Map component
import ReactMapGL, { FlyToInterpolator, Marker } from "react-map-gl";

import "./assets/style.css";

const InputLocation = (props) => {
  // State to keep autocomplete response
  const [addressAutocomplete, setAddressAutocomplete] = React.useState(null);
  // State to keep data from DB and new response date - this data will save to DB
  const [locationData, setLocationData] = React.useState(null);
  // Default state for marker, null if date is not set, if date is set on DB get lat and lng. On get new response from autocomplete is set lat and lng
  const [marker, setMarker] = React.useState(null);
  // Default coords for MapBox
  const defaultCoords = {
    latitude: 49.88,
    longitude: 15.156,
  };
  // Default marker settings depends on resolution of icon
  const defaultMarkerSettings = {
    offsetLeft: -30,
    offsetTop: -30,
  };
  // Default state for viewport, will update on update map or getting new response from autocomplete
  const [viewport, setViewport] = React.useState({
    width: "100%",
    height: 200,
    ...defaultCoords,
    zoom: 4,
    /**
     * ! Api key from MapBox should be in .env
     */
    mapboxApiAccessToken:
      "apiKey",
  });

  /**
   * Set new locationData depends on autocomplete
   *
   * @param {string} newPlaceId PlaceId from autcomplete
   * @param {string} fullAddress Full address
   * @param {string} city Only city (optional)
   * @param {string} country Only country
   */
  const loadLatLngPlaceID = async (newPlaceId, fullAddress, city, country) => {
    console.log("new place id : ", newPlaceId);
    const results = await getGeocode({ placeId: newPlaceId });
    const latLng = await getLatLng(results[0]);
    setLocationData({
      place_id: newPlaceId,
      /**
       * ! Uncomment this to save latLng to DB
       */
      // latLng: latLng,
      fullAddress: fullAddress,
      city: city,
      country: country,
    });
    const newViewport = {
      ...viewport,
      longitude: latLng.lng,
      latitude: latLng.lat,
      zoom: 14,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    };
    setViewport({ ...viewport, ...newViewport });
    setMarker({
      ...marker,
      ...defaultMarkerSettings,
      latitude: latLng.lat,
      longitude: latLng.lng,
    });
  };

  /**
   * Call when autocomplete save new data to state addressAutocomplete
   */
  React.useEffect(() => {
    if (addressAutocomplete) {
      console.log("full object address:", addressAutocomplete);
      let lastTerm = addressAutocomplete.value.terms.length;
      console.log("last term: ", lastTerm);
      let newPlaceId = addressAutocomplete.value.place_id
        ? addressAutocomplete.value.place_id
        : "";
      let fullAddress = addressAutocomplete.value.description
        ? addressAutocomplete.value.description
        : "";
      let city = "";
      if (lastTerm > 1) {
        city = addressAutocomplete.value.terms[lastTerm - 2].value
          ? addressAutocomplete.value.terms[lastTerm - 2].value
          : "";
      }
      let country = addressAutocomplete.value.terms[lastTerm - 1].value
        ? addressAutocomplete.value.terms[lastTerm - 1].value
        : "";
      // Call function to save lat and lng depends on autocomplete
      loadLatLngPlaceID(newPlaceId, fullAddress, city, country);
    }
  }, [addressAutocomplete]);

  const { name } = props;
  /**
   * Call whene set new locationData depends on autocomplete, save new data to field state
   */
  React.useEffect(() => {
    if (locationData) {
      let data = JSON.stringify(locationData);
      props.onChange({
        target: {
          name,
          value: locationData,
          type: "json",
        },
      });
    }
  }, [locationData]);

  /**
   * Call when value change, mainly on load set value from DB to locationData
   */
  React.useEffect(() => {
    if (props.value) {
      // let data = JSON.parse(value);
      console.log("field Value: ", props.value);
      // console.log("Hodnota fieldu: ", data);
      // const newViewport = {
      //   ...viewport,
      //   longitude: data.latLng.lng,
      //   latitude: data.latLng.lat,
      //   zoom: 14,
      //   transitionDuration: 1000,
      //   transitionInterpolator: new FlyToInterpolator(),
      // };
      // setLocationData({ ...data });
      // setViewport({ ...viewport, ...newViewport });
      // setMarker({
      //   ...marker,
      //   ...defaultMarkerSettings
      //   latitude: data.latLng.lat,
      //   longitude: data.latLng.lng,
      // });
    }
  }, [props.value]);

  return (
    <React.Fragment>
      <Text ellipsis fontWeight="500">
        <FormattedMessage id="location-input.names.location.field" />
      </Text>
      <div className="location-autocomplete">
        <GooglePlacesAutocomplete
          apiKey="apiKey"
          selectProps={{
            addressAutocomplete,
            onChange: setAddressAutocomplete,
          }}
          debounce={300}
          minLengthAutocomplete={3}
          onLoadFailed={(error) => {
            console.error("Could not inject Google script", error);
            strapi.notification.error("google.place.notification.error");
          }}
        />
      </div>
      <div className="location-map">
        <ReactMapGL
          {...viewport}
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
        >
          {marker ? (
            <Marker {...marker}>
              <img src={LocationIcon} width="30px" height="30px" />
            </Marker>
          ) : null}
        </ReactMapGL>
      </div>
      {locationData ? (
        <Padded top bottom right left size="md">
          <Text size="lg" fontWeight="bold">
            <span style={{ textAlign: "center" }}>
              {locationData.fullAddress}
            </span>
          </Text>
        </Padded>
      ) : null}
    </React.Fragment>
  );
};

export default InputLocation;
