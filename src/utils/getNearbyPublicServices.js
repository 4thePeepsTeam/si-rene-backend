const db = require("../db/firebase");
const { collection, getDocs, query, where } = require("firebase/firestore");

async function getNearbyPublicServices({ currentPosition, type }) {
  try {
    let publicServices = [];

    // read from db
    const serviceRef = collection(db, "officer");
    const q = query(
      serviceRef,
      where("role", "==", type),
      where("isOnCall", "==", false),
      where("isOnDuty", "==", false)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => publicServices.push(doc.data()));

    // get distance all services
    const publicServicesDistance = await Promise.all(
      publicServices.map(
        async (publicService) =>
          await getDistance({
            origin: currentPosition,
            destination: publicService.location,
          })
      )
    );

    publicServices = publicServices
      // merge public service data and distance
      .map((publicService, index) => ({
        ...publicService,
        routes: publicServicesDistance[index].routes[0],
      }))
      // sort shortest distance
      .sort((a, b) => a.routes.distanceMeters - b.routes.distanceMeters)
      // select 3 nearest
      .slice(0, 3);

    return publicServices;
  } catch (err) {
    throw err;
  }
}

async function getDistance({ origin, destination }) {
  const response = await fetch(
    `https://routes.googleapis.com/directions/v2:computeRoutes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask":
          "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: origin.latitude,
              longitude: origin.longitude,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.latitude,
              longitude: destination.longitude,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        departureTime: new Date().toISOString(),
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: "en-US",
        units: "IMPERIAL",
      }),
    }
  );
  const data = await response.json();
  return data;
}

module.exports = getNearbyPublicServices;
