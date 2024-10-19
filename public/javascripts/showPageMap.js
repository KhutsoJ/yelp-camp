maptilersdk.config.apiKey = maptilerApiKey;
const map = new maptilersdk.Map({
   container: 'map',
   style: maptilersdk.MapStyle.LIGHT,
   center: campground.geometry.coordinates, //starting position
   zoom: 10 //starting zoom
});