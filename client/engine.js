let pageUrl,
  pageUrlParams = {},
  socket,
  user,
  sceneElement,
  cameraElement,
  assetsElement;

const 
    DEFAULT_CAMERA_POSITION = { x: 0, y: 1.6, z: 0 },
    currentHost = 'http://' + new URL(window.location).host;

//================\\
// Init Functions \\
//================\\

function init() {
  // Need to figure out what view to enable here
  const initViewCallback = getViewCallback();

  sceneElement = document.querySelector("a-scene");
  cameraElement = document.querySelector("a-camera");
  assetsElement = sceneElement.querySelector("a-assets");

  loadScript("./game/socket.io/socket.io.js", initViewCallback);
}

function initWorld() {
  resetAframeState();

  addAframeAsset("cityModel", "./assets/VC.gltf");

  addAframeEntity(
    "a-entity",
    { "gltf-model": "#cityModel" },
    { x: 0, y: 0, z: 0 },
    {}
  );

  // Create user id
  user = {
    id: makeId(10) + new Date().getTime(),
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  };
  startWorld("test");
}

function initWorldSelectionView() {
  console.log("Hi");
  resetAframeState();
  // <a-asset-item id = "carrot" src = "./assets/CarrotAvatarglTF/scene.gltf"  ></a - asset - item >

  //  ad entity here
  cameraElement.setAttribute("wasd-controls-enabled", false);

  addAframeEntity("a-sky", { src: "./assets/space.jpg" }, {}, {});

  addAframeAsset("jupiter", "./assets/jupiterPlanetglTF/scene.gltf");
  addAframeEntity(
    "a-entity",
    {
      "gltf-model": "#jupiter",
      "link-to-play": currentHost,
      "play-video-on-hover": true,
      rotation: { x: 50, y: 50, z: 100 }
    },
    { x: -30, y: 10, z: -40 },
    {}
  );

  addAframeAsset("neptune", "./assets/neptunePlanetglTF/scene.gltf");
  addAframeEntity(
    "a-entity",
    {
      "gltf-model": "#neptune",
      "link-to-play": currentHost,
      "play-video-on-hover": true,
      rotation: { x: 50, y: 50, z: 100 }
    },
    { x: 30, y: 10, z: -40 },
    {}
  );
}

function initVideoSelectionView() {
// const fullScreenPlane = document.createElement("div");
    // fullScreenPlane.setAttribute("style", "position: absolute;width: 200%; height: 200%; top: 0px; left: 0px;");
    // fullScreenPlane.onclick = userJump;
    // document.body.appendChild(fullScreenPlane);

    // loadScript("https://unpkg.com/aframe-animation-component/dist/aframe-animation-component.min.js", () => {
        addAframeAsset('cityModel', './assets/VC.gltf');
        addAframeEntity('a-entity', {'gltf-model':'#cityModel'}, {x: 0, y: 0, z: 0}, {});

        // Create user id
        user = {
            id: makeId(10) + new Date().getTime(),
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0}
        };
        startWorld("test");
    // });
    
}

function userJump() {

    // check if user is on the ground
    // if not do nothing
    // else set animation on camera entity

    const cameraCurrentPosition = cameraElement.object3D.position;

    if(cameraCurrentPosition.y === DEFAULT_CAMERA_POSITION.y) {

        console.log("hi");
        cameraElement.parentNode.setAttribute("animation_jump", `autoplay:true; property:position; dur:2000; easing:linear; from:${cameraCurrentPosition.x} ${cameraCurrentPosition.y} ${cameraCurrentPosition.z}; to:${cameraCurrentPosition.x} ${cameraCurrentPosition.y + 10} ${cameraCurrentPosition.z}`)

    }
}

function initVideoSelectionView() {

    resetAframeState();

    cameraElement.setAttribute('wasd-controls-enabled',false);

    addAframeEntity('a-sky',{'src':'./assets/space.jpg'},{},{});

    addAframeAsset('sunrise', './assets/thumbnails/sunrise.jpeg');
    addAframeEntity('a-image', {'src':'./assets/thumbnails/sunrise.jpeg', 'link-to-play': currentHost + "/?view=video-private&videoId=sunrise", "play-video-on-hover":true, width:1.6, height:.9}, {x: 0, y: 1.5, z: -2}, {});
   
    addAframeAsset('aurora', './assets/thumbnails/aurora.jpg');
    addAframeEntity('a-image', {'src':'./assets/thumbnails/aurora.jpg', 'link-to-play': currentHost + "/?view=video-private&videoId=aurora", "play-video-on-hover":true, width:1.6, height:.9}, {x: -2, y: 1.5, z: -2}, {});

    addAframeAsset('flying', './assets/thumbnails/flying.jpg');
    addAframeEntity('a-image', {'src':'./assets/thumbnails/flying.jpg', 'link-to-play': currentHost + "/?view=video-private&videoId=flying", "play-video-on-hover":true, width:1.6, height:.9}, {x: 2, y: 1.5, z: -2}, {});



}

function initPrivateVideoView() {

    resetAframeState();

    // Create A-Frame scene
    // Add a 360 video url or local asset
    let videoSrc;
    if (pageUrlParams.videoId) {
        videoSrc=`./assets/videos/${pageUrlParams.videoId}.mp4`;
    } else {
        videoSrc="https://ucarecdn.com/fadab25d-0b3a-45f7-8ef5-85318e92a261/";
    }

    const sourceElement = document.createElement("source");
    sourceElement.setAttribute("type", "video/mp4");
    sourceElement.setAttribute("src", videoSrc);

    const videoElement = document.createElement("video");
    videoElement.setAttribute("id", "video");
    videoElement.setAttribute("autoplay", true);
    videoElement.setAttribute("loop", true);
    videoElement.setAttribute("crossorigin", "anonymous");
    videoElement.setAttribute("playsinline", true);
    videoElement.setAttribute("webkit-playsinline", true);

    videoElement.appendChild(sourceElement);
    assetsElement.appendChild(videoElement);

    const videoSphereElement =  document.createElement("a-videosphere");
    videoSphereElement.classList.add("addedElement");
    videoSphereElement.object3D.rotation.set(0, THREE.Math.degToRad(180), 0);
    videoSphereElement.setAttribute("src", "#video");

    sceneElement.appendChild(videoSphereElement);

    const playVideoInterval = setInterval(() => {
        let videoSrc = videoSphereElement.components.material.material.map.image;

        if (videoSrc) {
            videoSrc.play().then(() => {
                videoSphereElement.click();
                sceneElement.enterVR();
                clearInterval(playVideoInterval);
            });
        }

    }, 1000);
}

//===================\\
// Application Logic \\
//===================\\

// On world selection call startWorld
function startWorld(worldType) {

    // Should connect to socket and send player id
    socket = io({
        path: '/game/socket.io'
    });

    // Create player
    const userElement = document.createElement('a-box');
    userElement.setAttribute('id', user.id);
    userElement.setAttribute('camera-listener', null);
    userElement.classList.add('player');

    cameraElement.appendChild(userElement);

    // On player move send an update call
    socket.emit('userReady', user)

    // Start listening game tick events
    socket.on('tick', worldState => {
        updateWorldState(worldState);
    })

}

// Get all users
function updateWorldState(worldState) {
  // For each user
  // If current user do nothing
  // If new user create it
  // If user exists and is not current user update it's position and rotation

  worldState.users.forEach(worldUser => {
    if (worldUser.id === user.id) {
      // do nothing
    } else {
      // get user
      // if not found create it
      const userElement = document.querySelector(`#${worldUser.id}`);

      if (userElement) {
        updateUser(userElement, worldUser);
      } else {
        createUser(worldUser);
      }
    }
  });

    // For each user
    // If current user do nothing
    // If new user create it
    // If user exists and is not current user update it's position and rotation

    worldState.users.forEach(worldUser => {

        if (worldUser.id === user.id) {
            // do nothing
        } else {

            // get user
            // if not found create it
            const userElement = document.querySelector(`#${worldUser.id}`)

            if (userElement) {
                updateUser(userElement, worldUser);
            } else {
                createUser(worldUser);
            }
        }

    });
}

// Handle user leaving
// DOES NOT WORK ATM
window.addEventListener("onbeforeunload", removeUser());
window.addEventListener("onunload", removeUser());

function removeUser() {
  if (socket) {
    socket.emit("userLeft", user.id);
  }
}

function updateUser(userElement, worldUser) {
  userElement.object3D.position.set(
    worldUser.position.x,
    worldUser.position.y,
    worldUser.position.z
  );
  userElement.object3D.rotation.set(
    worldUser.rotation.x,
    worldUser.rotation.y,
    worldUser.rotation.z
  );
}

function createUser(worldUser) {
  // Create player
  const userElement = document.createElement("a-box");
  userElement.setAttribute("id", worldUser.id);
  userElement.classList.add("player");

  updateUser(userElement, worldUser);

  sceneElement.appendChild(userElement);
}

//=========\\
// A-Frame \\
//=========\\

function addAframeAsset(id, src) {
  const assetItem = document.createElement("a-asset-item");
  assetItem.setAttribute("id", id);
  assetItem.setAttribute("src", src);

  assetsElement.appendChild(assetItem);
}

function addAframeEntity(entityTagName, htmlProperties, position, rotation) {
  const entityElement = document.createElement(entityTagName);

  for (let propertyName in htmlProperties) {
    entityElement.setAttribute(propertyName, htmlProperties[propertyName]);
  }

  entityElement.object3D.position.set(
    position.x || 0,
    position.y || 0,
    position.z || 0
  );
  entityElement.object3D.rotation.set(
    rotation.x || 0,
    rotation.y || 0,
    rotation.z || 0
  );
  entityElement.classList.add("addedElement");

  sceneElement.appendChild(entityElement);
}

// All init functions should use this first
function resetAframeState() {
  // Remove all assets
  while (assetsElement.firstChild) {
    assetsElement.removeChild(assetsElement.firstChild);
  }

  // Remove Aframe all added elements
  const addedAframeElements = sceneElement.querySelectorAll(".addedElement");
  addedAframeElements.forEach(addedElement => {
    if (addedAframeElements.parentNode) {
      addedAframeElements.parentNode.removeChild(addedAframeElements);
    }
  });

  // Reset camera positon
  cameraElement.object3D.position.set(
    DEFAULT_CAMERA_POSITION.x,
    DEFAULT_CAMERA_POSITION.y,
    DEFAULT_CAMERA_POSITION.z
  );
}

AFRAME.registerComponent("camera-listener", {
  init: () => {
    this.currentState = {
      position: null,
      rotation: null
    };
  },
  tick: () => {
    const newPosition = clone(cameraElement.getAttribute("position")),
      newRotation = clone(cameraElement.getAttribute("rotation"));

    if (
      !objectsEqual(newPosition, this.currentState.position) ||
      !objectsEqual(newRotation, this.currentState.rotation)
    ) {
      this.currentState.position = newPosition;
      this.currentState.rotation = newRotation;
      console.log("User camera move", this.currentState);
      user.position = this.currentState.position;
      user.rotation = this.currentState.rotation;

      // Convert all degree values to rads
      for (let key in user.rotation) {
        user.rotation[key] = THREE.Math.degToRad(user.rotation[key]);
      }

      socket.emit("userUpdate", user);
    }
  }
});

AFRAME.registerComponent("play-video-on-hover", {
  init: function() {
    var data = this.data;
    var el = this.el; // <a-box>

    const linkToVisit = el.getAttribute("link-to-play");

    el.addEventListener("click", function() {
      window.location.replace(linkToVisit);
    });
  }
});

//=========\\
// Helpers \\
//=========\\

function makeId(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function objectsEqual(object1, object2) {
  return JSON.stringify(object1) === JSON.stringify(object2);
}

function clone(object) {
  return Object.assign({}, object);
}

function loadScript(url, callback) {
  const scriptElement = document.createElement("script");
  scriptElement.type = "text/javascript";
  if (scriptElement.readyState) {
    // only required for IE <9
    scriptElement.onreadystatechange = () => {
      if (
        scriptElement.readyState === "loaded" ||
        scriptElement.readyState === "complete"
      ) {
        scriptElement.onreadystatechange = null;
        callback();
      }
    };
  } else {
    //Others
    scriptElement.onload = () => {
      callback();
    };
  }

  scriptElement.src = url;
  document.getElementsByTagName("head")[0].appendChild(scriptElement);
}

// Returns an init callback for loading the initial view using query parameters
function getViewCallback() {
  loadQueryParameters();

  // Default case if no URL view parameter
  if (typeof pageUrlParams.view === "undefined") {
    return initWorld;
  }

  // baised on query parameters return view init callback
  switch (pageUrlParams.view) {
    case "login":
      break;
    case "experience-selection":
      break;
    case "world-selection":
      return initWorldSelectionView;
      break;
    case "video-selection":
      return initVideoSelectionView;
      break;
    case "video-private":
      return initPrivateVideoView;
      break;
    default:
      break;
  }
}

function loadQueryParameters() {
  pageUrl = new URL(window.location);

  // Default case if no URL parameters provider
  if (!pageUrl.search) {
    return;
  }

  // Might need a case to handle cases where no ? found
  const rawSearchQueries = pageUrl.search.split("?")[1].split("&");

  rawSearchQueries.forEach(searchQuery => {
    const splitSearchQuery = searchQuery.split("=");
    pageUrlParams[splitSearchQuery[0]] = splitSearchQuery[1];
  });

  console.log(rawSearchQueries);
}
