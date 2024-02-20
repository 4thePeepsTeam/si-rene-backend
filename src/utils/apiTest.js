const db = require("../db/firebase");
const { collection, getDocs, query, where } = require("firebase/firestore");

async function dbTest(req, res, next) {
  try {
    const publicServices = [];

    // read from db
    const serviceRef = collection(db, "officer");
    const q = query(
      serviceRef,
      where("role", "==", "ambulance"),
      where("isOnCall", "==", false),
      where("isOnDuty", "==", false)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => publicServices.push(doc.data()));

    res.json({
      data: publicServices,
    });
  } catch (error) {
    res.json({
      error: error,
      message: "error",
    });
  }
}

async function routesApiTest(req, res, next) {
  const origin = {
    latitude: -7.719376150216368,
    longitude: 109.99645303243706,
  };
  const destination = {
    latitude: -7.594392527337097,
    longitude: 110.08564065755614,
  };

  try {
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
          departureTime: new Date(
            new Date().getTime() + 5 * 60 * 1000
          ).toISOString(),
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

    res.json({
      data: data,
      datetimeISO: new Date(new Date().getTime() + 5 * 60 * 1000).toISOString(),
      datetime: new Date(),
    });
  } catch (error) {
    res.json({
      error: error,
      datetimeISO: new Date().toISOString(),
      datetime: new Date(),
      message: "error",
    });
  }
}

module.exports = {
  dbTest,
  routesApiTest,
};
