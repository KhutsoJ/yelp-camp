maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
   container: 'map',
   style: maptilersdk.MapStyle.BRIGHT,
   center: campground.geometry.coordinates, //starting position
   zoom: 10 //starting zoom
});

new maptilersdk.Marker()
   .setLngLat(campground.geometry.coordinates)
   .setPopup(
      new maptilersdk.Popup({ offset: 25 })
         .setHTML(
            `<h3>${campground.name}</h3><p>${campground.location}</p>`
         )
   )
   .addTo(map);