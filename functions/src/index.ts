
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
const algoliasearch = require("algoliasearch");

admin.initializeApp();


const ALGOLIA_APP_ID = "NLP62OB0FG";
const ALGOLIA_ADMIN_KEY = "674fbc684f467be61944c97cf3b12e3c";
const ALGOLIA_INDEX_NAME = "products";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

export const onProductCreated = functions.firestore
  .document("products/{productId}")
  .onCreate(async (snap, context) => {
    try {
      const product = snap.data();
      product.objectID = snap.id;
      await index.saveObject(product);
    } catch (error) {
      functions.logger.error(
        "Error indexing product to Algolia:",
        error
      );
    }
  });

export const onProductUpdated = functions.firestore
  .document("products/{productId}")
  .onUpdate(async (change, context) => {
    try {
      const product = change.after.data();
      product.objectID = change.after.id;
      await index.saveObject(product);
    } catch (error) {
      functions.logger.error(
        "Error updating product in Algolia:",
        error
      );
    }
  });

export const onProductDeleted = functions.firestore
  .document("products/{productId}")
  .onDelete(async (snap, context) => {
    try {
      await index.deleteObject(snap.id);
    } catch (error) {
      functions.logger.error(
        "Error deleting product from Algolia:",
        error
      );
    }
  });

export const fetchSocialFeeds = functions.pubsub.schedule("every 30 minutes").onRun(async (context) => {
  const twitterUrl = `https://api.twitter.com/2/tweets/search/recent?query=from:watchrasta`;
  const instagramUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,permalink`;

  const twitterOptions = {
    headers: {
      "Authorization": `Bearer ${functions.config().twitter.bearer_token}`
    }
  };

  const instagramOptions = {
    params: {
      "access_token": functions.config().instagram.access_token
    }
  }

  try {
    const [twitterResponse, instagramResponse] = await Promise.all([
      axios.get(twitterUrl, twitterOptions),
      axios.get(instagramUrl, instagramOptions)
    ]);

    const socialFeed = {
      twitter: twitterResponse.data.data,
      instagram: instagramResponse.data.data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore().collection("social_feed").doc("latest").set(socialFeed);
    functions.logger.log("Successfully fetched and stored social feeds.");

  } catch (error) {
    functions.logger.error("Error fetching social feeds:", error);
  }
});
export * from "./links";
