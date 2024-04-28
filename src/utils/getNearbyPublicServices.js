const db = require("../db/firebase");
const { collection, getDocs, query, where } = require("firebase/firestore");

async function getNearbyPublicServices({ currentPosition, type }) {
  try {
    // get public services
    let publicServices = await getPublicServices({ type: type });

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
        routes: publicServicesDistance[index].routes?.[0] ?? null,
      }))
      // remove service if route == null
      .filter((publicService) => publicService.routes != null)
      // sort shortest distance
      .sort((a, b) => a.routes.distanceMeters - b.routes.distanceMeters)
      // select 3 nearest
      .slice(0, 3);

    return publicServices;
  } catch (error) {
    throw error;
  }
}

async function getPublicServices({ type }) {
  try {
    const publicServices = [];

    // Read from Firestore
    const serviceRef = collection(db, "officer");
    const q = query(
      serviceRef,
      where("role", "==", type),
      where("isOnCall", "==", false),
      where("isOnDuty", "==", false)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const serviceData = doc.data();
      serviceData.id = doc.id; // Add document ID to the data object
      publicServices.push(serviceData);
    });

    return publicServices;
  } catch (error) {
    throw error; // Re-throw the error for proper handling
  }
}

async function getDistance({ origin, destination }) {
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
    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = getNearbyPublicServices;
