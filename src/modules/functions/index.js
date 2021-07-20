import axios from "axios";

const storageGet = (key) => {
  const item = window.localStorage.getItem(key);
  if (item !== null) {
    var parsed = item;
    try {
      parsed = JSON.parse(parsed);
    } catch (e) {
      //console.log(e)
      //parsed = parsed.toString();
    }
    return parsed;
  }
  return null
};
const storageSet = (key, ob) => {
  if (typeof ob === "string") {
    window.localStorage.setItem(key, ob);
  } else {
    window.localStorage.setItem(key, JSON.stringify(ob));
  }
};

const storageDel = (key) => window.localStorage.removeItem(key);
const storageClear = () => window.localStorage.clear();


const api = axios.create({
  //baseURL: server.value,
  timeout: 0,
  headers: {
    "Content-Type": "application/json",
    //"X-AppApiToken": vars.key,
  },
});
export {
  storageGet,
  storageSet,
  storageDel,
  storageClear,
  api,
};
