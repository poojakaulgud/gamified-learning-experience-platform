const { Firestore } = require('@google-cloud/firestore');

// Create a new client
const fs = new Firestore({
  projectId: 'methodologysandbox',
});

// Create a new collection
// This function creates a document in the collection with a random id
// The document has two fields: name and message
// If this collection does not exist yet, it will be created
async function createCollection(collectionName) {
  fs.collection(collectionName).add({
    name: 'Hello, Firestore!',
    message: 'Welcome to Firestore',
  });
  console.log('Collection created');
}

// Create a new collection
// Here we are creating a new collection called "first_collection"
// When you run this code, you will see a new collection in the Firestore console
const new_collection_name = 'first_collection';
let collection_creation = (async () => {
  await createCollection(new_collection_name);
  // List all collections in the database
  fs.listCollections().then((collections) => {
    for (let collection of collections) {
      console.log(`Found collection with id: ${collection.id}`);
    }
    console.log('Done');
  });
})();

// Obtain a document reference.
// This directly references a specific document in a collection
// Here we're setting the name of the document explicitly
const document = fs.doc('collection_1/intro-to-firestore');

// Enter new data into the document.
// This data will be stored in the Firestore database at the specified documnet reference

async function addDataToDocument(document) {
  document
    .set({
      title: 'Welcome to Firestore',
      body: 'Hello World',
    })
    .then(() => {
      console.log('Document created');
    });
}

let document_creation = (async () => {
  await addDataToDocument(document);
})();

// Some example data
// This data will be stored in the Firestore database at the specified documnet reference
const data = {
  product_line: 'Industrial Electronics',
  product_name: 'Power Supply',
  product_revision: 'Rev 1.0',
  product_description: 'A power supply for industrial applications',
  product_id: '123456',
};

const also_data = {
  product_line: 'Industrial Electronics',
  product_name: 'Generator Controller',
  product_revision: 'Rev 1.0',
  product_id: '123457',
  product_category: 'Controllers',
};

// Now we want to batch add this data to the database
// This is a batch write operation
// This is useful for adding multiple documents at once
var batch = fs.batch();
const dataObjs = [data, also_data];

// Setting the operation to add the data for each piece of data
// here, we can use product_id as the document id

let batch_write = (async () => {
  dataObjs.forEach((dataObj) => {
    var docRef = fs.collection('product_catalog').doc(dataObj.product_id);
    batch.set(docRef, dataObj); // set will overwrite the document if it already exists
  });

  await batch.commit().then(() => {
    console.log('Batch write completed');
  });
})();

// Remove the collection
// This function deletes the collection with the specified name
function deleteCollection(collectionName) {
  fs.collection(collectionName)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
  console.log('%s: collection deleted', collectionName);
}

// Once all the operations are complete, we can clear the database
Promise.all([collection_creation, document_creation, batch_write]).then(() => {
  console.log('All example operations complete, clearing database...');
  // To go and clear it all !!
  // This will delete all collections in the database
  fs.listCollections().then((collections) => {
    for (let collection of collections) {
      deleteCollection(collection.id);
    }
    console.log('Done');
  });
});
