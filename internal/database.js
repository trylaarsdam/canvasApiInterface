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
  getCollection
}

async function setDoc(collection, doc, data) {
  try {
    await db.collection(collection).doc(doc).set(data);
  } catch (error) {
    console.log(error);
  }
}

async function getCollection(collection) {
  try {
    const query = await db.collecetion(collection).get();
    return query.docs.map(doc => doc.data());
  } catch(error) {
    console.log(error);
  }
}

async function deleteDoc(collection, doc) {
  try {
    await db.collection(collection).doc(doc).delete();
  } catch (error) {
    console.log(error);
  }
}

async function getDoc(collection, doc) {
  try {
    const docRef = await db.collection(collection).doc(doc).get();
    return docRef.data();
  } catch (error) {
    console.log(error);
  }
}

async function query(collection, key, operator, value) {
  try {
    const query = await db.collection(collection).where(key, operator, value).get();
    return query.docs.map(doc => doc.data());
  } catch (error) {
    console.log(error);
  }
}