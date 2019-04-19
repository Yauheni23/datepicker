import get from './get';
import { config } from '../config';

function getNameLocation() {
  return new Promise((fulfilled) => {
    navigator.geolocation.getCurrentPosition(result => {
      get(`${config.GOOGLE_MAPS}?apikey=${ config.API_KEY }&format=json&geocode=${ result.coords.longitude },${ result.coords.latitude }`)
        .then(res => {
          const location = JSON.parse(res);
          let сity = location.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData
            .AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
          fulfilled(сity);
        });
    });
  });
}

export default getNameLocation;
