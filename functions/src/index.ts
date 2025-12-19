import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import algoliasearch from "algoliasearch";

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
