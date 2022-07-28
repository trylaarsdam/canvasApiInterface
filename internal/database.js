const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const dev = require("../dev.json");
const keys = require("../ac-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(keys),
})

const db = admin.firestore();

module.exports = {
  setDoc,
  deleteDoc,
  getDoc,
  query,
  getCollection,
  mergeDoc
}

async function mergeDoc(collection, doc, data) {
  console.log("merge")
  try {
    await db.collection(collection).doc(doc).set(data, {merge: true});
  } catch (error) {
    console.log(error);
  }
}

async function setDoc(collection, doc, data) {
  console.log("set")
  try {
    await db.collection(collection).doc(doc).set(data);
  } catch (error) {
    console.log(error);
  }
}

async function getCollection(collection) {
  console.log("getcollection")
  try {
    const query = await db.collection(collection).limit(150).get();
    return query.docs.map(doc => doc.data());
  } catch(error) {
    console.log(error);
  }
}

async function deleteDoc(collection, doc) {
  console.log("delete")
  try {
    await db.collection(collection).doc(doc).delete();
  } catch (error) {
    console.log(error);
  }
}

async function getDoc(collection, doc) {
  console.log("getdoc")
  try {
    const docRef = await db.collection(collection).doc(doc).get();
    return docRef.data();
  } catch (error) {
    console.log(error);
  }
}

async function query(collection, key, operator, value) {
  console.log("query")
  try {
    const query = await db.collection(collection).where(key, operator, value).get();
    return query.docs.map(doc => doc.data());
  } catch (error) {
    console.log(error);
  }
}