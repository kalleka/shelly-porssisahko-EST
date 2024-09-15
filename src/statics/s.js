/**
 * shelly-porssisahko
 * 
 * (c) Jussi isotalo - http://jisotalo.fi
 * https://github.com/jisotalo/shelly-porssisahko
 * 
 * License: GNU Affero General Public License v3.0 
 * Modified by Kalle Kaljuste 2024-09-09
 */
/** URL of the shelly (only if DEV active, otherwise it is same origin) */
let URL = "";

/** URL of the logic script */
let URLS = ``;

/** Shortcut for querySelector() call */
let qs = (s) => document.querySelector(s);

/**
 * debug function that is printing to console only when DEV is active
 */
let DBG = () => { };

/**
 * Enumeration of state
 */
let STATE_STR = [
  "Käivitamine", //0
  "Käsitsi lülitamine", //1
  "Hind alla piirmäära", //2
  "Hind üle piirmäära", //3
  "Hind ei ole sellel perioodil soodsaim", //4
  "Hind on sellel perioodil soodsaim", //5
  "Hind soodsam kui \"alati sees\" piirmäär", //6
  "Lülitus hinnainfo puudumisel (kell paigas)", //7
  "Rikkekaitse (Shelly kellaaeg teadmata)", //8
  "Käsitsi lülitatus (kuni %s)", //9
  "Käsitsi määratud tund", //10
  "Hind üle maksimumpiiri", //11
  "Kasutaja lisaskripti poolt seatud", //12
  "Määratud lülitusminutid läbi" //13
]

/**
 * Enumeration of mode
 */
let MODE_STR = [
  "Käsitsi lülitamine",
  "Hinnapiir",
  "Perioodi soodsaimad tunnid"
]

/**
 * Global state
 * 
 * undefined = not yet read
 * null = error
 */
let state = undefined;

/** Callbacks called when state is updated */
let CBS = [];

/**
 * Helper that is used for DBG calls to add caller information
 */
let me = () => "";

/**
 * Opens tab with given id
 * @param {*} tab 
 * @returns 
 */
let openTab = async (tab) => {
  if (tab === undefined || tab === "") {
    tab = "tab-status";
  }
  window.location.hash = tab;

  let e = qs("#" + tab);
  if (e) {
    e.checked = true;
  }

  if (qs(`#c-${tab}`).innerHTML === "") {
    await populateDynamicData(`${tab}.html`, `#c-${tab}`);
  }
};

window.onload = async () => {
  openTab(window.location.hash.substring(window.location.hash.indexOf("#") + 1));
};

document.querySelectorAll(".ts").forEach(e => e.addEventListener("change", (e) => {
  openTab(e.target.id);
}));

let evalContainerScriptTags = (elementId) => {
  DBG(me(), "eval running for", elementId);

  var scripts = qs(elementId).querySelectorAll("script");
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].innerText) {
      /*DBG(scripts[i].innerText);*/
      eval(scripts[i].innerText);
    } else {
      fetch(scripts[i].src).then(function (data) {
        data.text().then(function (r) {
          eval(r);
        })
      });
    }
    scripts[i].parentNode.removeChild(scripts[i]);
  }
}

let populateDynamicData = async (url, containerId) => {
  try {
    if (!DEV) {
      url = `${URLS}?r=${url.replace("tab-", "").replace(".html", "")}`
    }
    DBG(me(), "fetching", url, "for", containerId);

    let res = await getData(url, false);
    if (res.ok) {
      qs(containerId).innerHTML = res.data;
      evalContainerScriptTags(containerId);
    } else {
      qs(containerId).innerHTML = `Error getting data: ${res.txt}`;
    }
    DBG(me(), "done for", containerId);
  } catch (err) {
    DBG(me(), "error", err);
    console.error(err);
  }
}


let getData = async (url, isJson = true) => {
  try {
    let res = await fetch(url);

    if (res.ok) {
      let data = null;

      if (res.status !== 204) {
        if (isJson) {
          data = await res.json();
        } else {
          data = await res.text();
        }
      }
      DBG(me(), `Fetching ${url} done. Status code: ${res.status}`);

      return {
        ok: true,
        code: res.status,
        txt: res.statusText,
        data
      };

    } else {
      console.error(`${url}: ${res.statusText}`);

      return {
        ok: false,
        code: res.status,
        txt: `${url}: ${res.statusText} (${(await res.text())})`,
        data: null
      };

    }
  } catch (err) {
    console.error(`${url}: (${JSON.stringify(err)})`);

    return {
      ok: false,
      code: -1,
      txt: `${url}: (${JSON.stringify(err)})`,
      data: null
    };
  }
}

let formatDate = (date) => {
  return `${(date.getDate().toString().padStart(2, "0"))}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
}

let formatTime = (date, showSeconds = true, showMilliseconds = false) => {
  return `${(date.getHours().toString().padStart(2, "0"))}:${date.getMinutes().toString().padStart(2, "0")}${(showSeconds ? `:${date.getSeconds().toString().padStart(2, "0")}` : "")}${(showMilliseconds ? `.${date.getMilliseconds().toString().padStart(3, "0")}` : "")}`;
}

let formatDateTime = (date, showSeconds = true, showMilliseconds = false) => {
  return `${formatDate(date)} ${formatTime(date, showSeconds, showMilliseconds)}`;
}

let updateLoop = async () => {
  DBG(me(), "Updating");
  qs("#spin").style.visibility = "visible";

  try {
    let res = await getData(`${URLS}?r=s`);

    if (res.ok) {
      state = res.data;

      //If status 503 the shelly is just now busy running the logic -> do nothing
    } else if (res.code !== 503) {
      state = null;
    }

    CBS.forEach(cb => cb());

  } catch (err) {
    console.error(err);
    state = null;

  } finally {
    qs("#spin").style.visibility = "hidden";
    setTimeout(updateLoop, 10000);
  }
}

if (DEV) {
  reqJs("dev.js");
} else {
  updateLoop();
}