/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/ajaxHelpers.js":
/*!*******************************!*\
  !*** ./client/ajaxHelpers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllPlayers": () => (/* binding */ fetchAllPlayers),
/* harmony export */   "fetchSinglePlayer": () => (/* binding */ fetchSinglePlayer),
/* harmony export */   "addNewPlayer": () => (/* binding */ addNewPlayer),
/* harmony export */   "removePlayer": () => (/* binding */ removePlayer)
/* harmony export */ });

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2206-FTB-ET-WEB-FT";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const fetchAllPlayers = async () => {
  try {
    let response = await fetch(`${APIURL}/players`);
    let result = await response.json();
    if (result.error) throw result.error;
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    let response = await fetch(`${APIURL}players/${playerId}`);
    let result = await response.json();
    if (result.error) throw result.error;
    return result.data.player;
  } catch (err) {
    console.error("Uh oh, trouble fetching single player!", err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    let response = await fetch(`${APIURL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playerObj.name,
        breed: playerObj.breed,
      }),
    });
    let result = await response.json();
    return result.data.players;
  } catch (error) {
    console.log("There was an error:", error);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.error) throw result.error;
    return;
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};


/***/ }),

/***/ "./client/renderHelpers.js":
/*!*********************************!*\
  !*** ./client/renderHelpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderAllPlayers": () => (/* binding */ renderAllPlayers),
/* harmony export */   "renderSinglePlayer": () => (/* binding */ renderSinglePlayer),
/* harmony export */   "renderNewPlayerForm": () => (/* binding */ renderNewPlayerForm)
/* harmony export */ });
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");


const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = "<h3>No players to display!</h3>";
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = "";
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
        <button class="delete-button" data-id=${pup.id}>Remove from roster</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName("detail-button")];
  for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener("click", async (event) => {
      let pupId = event.target.dataset.id;
      const pupObj = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchSinglePlayer)(pupId);
      renderSinglePlayer(pupObj);

      let deleteButtons = [...document.getElementsByClassName("delete-button")];
      for (let i = 0; i < deleteButtons.length; i++) {
        const button = deleteButtons[i];
        button.addEventListener("click", async () => {
          await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.removePlayer)(button.dataset.id);
          const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
          renderAllPlayers(players);
        });
      }
    });
  }
};

const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : "Unassigned"}</p>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${
    playerObj.name
  } the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;
};

const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector("#new-player-form > form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let playerData = {
      name: form.elements.name.value,
      breed: form.elements.breed.value,
    };
    await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.addNewPlayer)(playerData);
    let newPlayers = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
    renderAllPlayers(newPlayers);
    return (playerData = {
      name: (form.elements.name.value = ""),
      breed: (form.elements.breed.value = ""),
    });
  });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");
/* harmony import */ var _renderHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderHelpers */ "./client/renderHelpers.js");



const init = async () => {
  const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
  (0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderAllPlayers)(players);
  (0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderNewPlayerForm)();
};

init();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdXBweWJvd2wtd29ya3Nob3AvLi9jbGllbnQvYWpheEhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L3JlbmRlckhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3B1cHB5Ym93bC13b3Jrc2hvcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCxXQUFXOztBQUUvRDtBQUNQO0FBQ0Esa0NBQWtDLE9BQU87QUFDekM7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0Esa0NBQWtDLE9BQU8sVUFBVSxTQUFTO0FBQzVEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLGtDQUFrQyxPQUFPO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSxvQ0FBb0MsT0FBTyxXQUFXLFNBQVM7QUFDL0Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsMENBQTBDLFNBQVM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hEdUI7O0FBRXZCO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFNBQVM7QUFDMUMsbUNBQW1DLE9BQU87QUFDMUM7QUFDQSxvQkFBb0IsYUFBYSxrQkFBa0IsU0FBUztBQUM1RCxnREFBZ0QsT0FBTztBQUN2RCxnREFBZ0QsT0FBTztBQUN2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDBCQUEwQjtBQUMzQztBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsK0RBQWlCO0FBQzVDOztBQUVBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0EsZ0JBQWdCLDBEQUFZO0FBQzVCLGdDQUFnQyw2REFBZTtBQUMvQztBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGVBQWU7QUFDOUMsaUNBQWlDLGFBQWE7QUFDOUM7QUFDQSxpQkFBaUIsb0RBQW9EO0FBQ3JFLGtCQUFrQixnQkFBZ0I7QUFDbEMsa0JBQWtCLG1CQUFtQjtBQUNyQztBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSwwREFBWTtBQUN0QiwyQkFBMkIsNkRBQWU7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOzs7Ozs7O1VDakhBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7OztBQ05nRDtBQUN3Qjs7QUFFeEU7QUFDQSx3QkFBd0IsNkRBQWU7QUFDdkMsRUFBRSxnRUFBZ0I7QUFDbEIsRUFBRSxtRUFBbUI7QUFDckI7O0FBRUEiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBBZGQgeW91ciBjb2hvcnQgbmFtZSB0byB0aGUgY29ob3J0TmFtZSB2YXJpYWJsZSBiZWxvdywgcmVwbGFjaW5nIHRoZSAnQ09IT1JULU5BTUUnIHBsYWNlaG9sZGVyXG5jb25zdCBjb2hvcnROYW1lID0gXCIyMjA2LUZUQi1FVC1XRUItRlRcIjtcbi8vIFVzZSB0aGUgQVBJVVJMIHZhcmlhYmxlIGZvciBmZXRjaCByZXF1ZXN0c1xuY29uc3QgQVBJVVJMID0gYGh0dHBzOi8vZnNhLXB1cHB5LWJvd2wuaGVyb2t1YXBwLmNvbS9hcGkvJHtjb2hvcnROYW1lfS9gO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hBbGxQbGF5ZXJzID0gYXN5bmMgKCkgPT4ge1xuICB0cnkge1xuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSVVSTH0vcGxheWVyc2ApO1xuICAgIGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3VsdC5lcnJvcikgdGhyb3cgcmVzdWx0LmVycm9yO1xuICAgIHJldHVybiByZXN1bHQuZGF0YS5wbGF5ZXJzO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiVWggb2gsIHRyb3VibGUgZmV0Y2hpbmcgcGxheWVycyFcIiwgZXJyKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGZldGNoU2luZ2xlUGxheWVyID0gYXN5bmMgKHBsYXllcklkKSA9PiB7XG4gIHRyeSB7XG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJVVJMfXBsYXllcnMvJHtwbGF5ZXJJZH1gKTtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGlmIChyZXN1bHQuZXJyb3IpIHRocm93IHJlc3VsdC5lcnJvcjtcbiAgICByZXR1cm4gcmVzdWx0LmRhdGEucGxheWVyO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiVWggb2gsIHRyb3VibGUgZmV0Y2hpbmcgc2luZ2xlIHBsYXllciFcIiwgZXJyKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFkZE5ld1BsYXllciA9IGFzeW5jIChwbGF5ZXJPYmopID0+IHtcbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElVUkx9L3BsYXllcnNgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG5hbWU6IHBsYXllck9iai5uYW1lLFxuICAgICAgICBicmVlZDogcGxheWVyT2JqLmJyZWVkLFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcmVzdWx0LmRhdGEucGxheWVycztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhcIlRoZXJlIHdhcyBhbiBlcnJvcjpcIiwgZXJyb3IpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlUGxheWVyID0gYXN5bmMgKHBsYXllcklkKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElVUkx9L3BsYXllcnMvJHtwbGF5ZXJJZH1gLCB7XG4gICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgfSk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGlmIChyZXN1bHQuZXJyb3IpIHRocm93IHJlc3VsdC5lcnJvcjtcbiAgICByZXR1cm47XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICBgV2hvb3BzLCB0cm91YmxlIHJlbW92aW5nIHBsYXllciAjJHtwbGF5ZXJJZH0gZnJvbSB0aGUgcm9zdGVyIWAsXG4gICAgICBlcnJcbiAgICApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgYWRkTmV3UGxheWVyLFxuICBmZXRjaEFsbFBsYXllcnMsXG4gIGZldGNoU2luZ2xlUGxheWVyLFxuICByZW1vdmVQbGF5ZXIsXG59IGZyb20gXCIuL2FqYXhIZWxwZXJzXCI7XG5cbmNvbnN0IHBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxsLXBsYXllcnMtY29udGFpbmVyXCIpO1xuY29uc3QgbmV3UGxheWVyRm9ybUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXBsYXllci1mb3JtXCIpO1xuXG5leHBvcnQgY29uc3QgcmVuZGVyQWxsUGxheWVycyA9IChwbGF5ZXJMaXN0KSA9PiB7XG4gIC8vIEZpcnN0IGNoZWNrIGlmIHdlIGhhdmUgYW55IGRhdGEgYmVmb3JlIHRyeWluZyB0byByZW5kZXIgaXQhXG4gIGlmICghcGxheWVyTGlzdCB8fCAhcGxheWVyTGlzdC5sZW5ndGgpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gXCI8aDM+Tm8gcGxheWVycyB0byBkaXNwbGF5ITwvaDM+XCI7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIHRoZSBsaXN0IG9mIHBsYXllcnMsIGFuZCBjb25zdHJ1Y3Qgc29tZSBIVE1MIHRvIGRpc3BsYXkgZWFjaCBvbmVcbiAgbGV0IHBsYXllckNvbnRhaW5lckhUTUwgPSBcIlwiO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwdXAgPSBwbGF5ZXJMaXN0W2ldO1xuICAgIGxldCBwdXBIVE1MID0gYFxuICAgICAgPGRpdiBjbGFzcz1cInNpbmdsZS1wbGF5ZXItY2FyZFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyLWluZm9cIj5cbiAgICAgICAgICA8cCBjbGFzcz1cInB1cC10aXRsZVwiPiR7cHVwLm5hbWV9PC9wPlxuICAgICAgICAgIDxwIGNsYXNzPVwicHVwLW51bWJlclwiPiMke3B1cC5pZH08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aW1nIHNyYz1cIiR7cHVwLmltYWdlVXJsfVwiIGFsdD1cInBob3RvIG9mICR7cHVwLm5hbWV9IHRoZSBwdXBweVwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZGV0YWlsLWJ1dHRvblwiIGRhdGEtaWQ9JHtwdXAuaWR9PlNlZSBkZXRhaWxzPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJkZWxldGUtYnV0dG9uXCIgZGF0YS1pZD0ke3B1cC5pZH0+UmVtb3ZlIGZyb20gcm9zdGVyPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuICAgIHBsYXllckNvbnRhaW5lckhUTUwgKz0gcHVwSFRNTDtcbiAgfVxuXG4gIC8vIEFmdGVyIGxvb3BpbmcsIGZpbGwgdGhlIGBwbGF5ZXJDb250YWluZXJgIGRpdiB3aXRoIHRoZSBIVE1MIHdlIGNvbnN0cnVjdGVkIGFib3ZlXG4gIHBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSBwbGF5ZXJDb250YWluZXJIVE1MO1xuXG4gIC8vIE5vdyB0aGF0IHRoZSBIVE1MIGZvciBhbGwgcGxheWVycyBoYXMgYmVlbiBhZGRlZCB0byB0aGUgRE9NLFxuICAvLyB3ZSB3YW50IHRvIGdyYWIgdGhvc2UgXCJTZWUgZGV0YWlsc1wiIGJ1dHRvbnMgb24gZWFjaCBwbGF5ZXJcbiAgLy8gYW5kIGF0dGFjaCBhIGNsaWNrIGhhbmRsZXIgdG8gZWFjaCBvbmVcbiAgbGV0IGRldGFpbEJ1dHRvbnMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImRldGFpbC1idXR0b25cIildO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRldGFpbEJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBidXR0b24gPSBkZXRhaWxCdXR0b25zW2ldO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICBsZXQgcHVwSWQgPSBldmVudC50YXJnZXQuZGF0YXNldC5pZDtcbiAgICAgIGNvbnN0IHB1cE9iaiA9IGF3YWl0IGZldGNoU2luZ2xlUGxheWVyKHB1cElkKTtcbiAgICAgIHJlbmRlclNpbmdsZVBsYXllcihwdXBPYmopO1xuXG4gICAgICBsZXQgZGVsZXRlQnV0dG9ucyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZGVsZXRlLWJ1dHRvblwiKV07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlbGV0ZUJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZGVsZXRlQnV0dG9uc1tpXTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgcmVtb3ZlUGxheWVyKGJ1dHRvbi5kYXRhc2V0LmlkKTtcbiAgICAgICAgICBjb25zdCBwbGF5ZXJzID0gYXdhaXQgZmV0Y2hBbGxQbGF5ZXJzKCk7XG4gICAgICAgICAgcmVuZGVyQWxsUGxheWVycyhwbGF5ZXJzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJTaW5nbGVQbGF5ZXIgPSAocGxheWVyT2JqKSA9PiB7XG4gIGlmICghcGxheWVyT2JqIHx8ICFwbGF5ZXJPYmouaWQpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gXCI8aDM+Q291bGRuJ3QgZmluZCBkYXRhIGZvciB0aGlzIHBsYXllciE8L2gzPlwiO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBwdXBIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzaW5nbGUtcGxheWVyLXZpZXdcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXItaW5mb1wiPlxuICAgICAgICA8cCBjbGFzcz1cInB1cC10aXRsZVwiPiR7cGxheWVyT2JqLm5hbWV9PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInB1cC1udW1iZXJcIj4jJHtwbGF5ZXJPYmouaWR9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8cD5UZWFtOiAke3BsYXllck9iai50ZWFtID8gcGxheWVyT2JqLnRlYW0ubmFtZSA6IFwiVW5hc3NpZ25lZFwifTwvcD5cbiAgICAgIDxwPkJyZWVkOiAke3BsYXllck9iai5icmVlZH08L3A+XG4gICAgICA8aW1nIHNyYz1cIiR7cGxheWVyT2JqLmltYWdlVXJsfVwiIGFsdD1cInBob3RvIG9mICR7XG4gICAgcGxheWVyT2JqLm5hbWVcbiAgfSB0aGUgcHVwcHlcIj5cbiAgICAgIDxidXR0b24gaWQ9XCJzZWUtYWxsXCI+QmFjayB0byBhbGwgcGxheWVyczwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSBwdXBIVE1MO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlck5ld1BsYXllckZvcm0gPSAoKSA9PiB7XG4gIGxldCBmb3JtSFRNTCA9IGBcbiAgICA8Zm9ybT5cbiAgICAgIDxsYWJlbCBmb3I9XCJuYW1lXCI+TmFtZTo8L2xhYmVsPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiAvPlxuICAgICAgPGxhYmVsIGZvcj1cImJyZWVkXCI+QnJlZWQ6PC9sYWJlbD5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJicmVlZFwiIC8+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICA8L2Zvcm0+XG4gIGA7XG4gIG5ld1BsYXllckZvcm1Db250YWluZXIuaW5uZXJIVE1MID0gZm9ybUhUTUw7XG5cbiAgbGV0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25ldy1wbGF5ZXItZm9ybSA+IGZvcm1cIik7XG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCBwbGF5ZXJEYXRhID0ge1xuICAgICAgbmFtZTogZm9ybS5lbGVtZW50cy5uYW1lLnZhbHVlLFxuICAgICAgYnJlZWQ6IGZvcm0uZWxlbWVudHMuYnJlZWQudmFsdWUsXG4gICAgfTtcbiAgICBhd2FpdCBhZGROZXdQbGF5ZXIocGxheWVyRGF0YSk7XG4gICAgbGV0IG5ld1BsYXllcnMgPSBhd2FpdCBmZXRjaEFsbFBsYXllcnMoKTtcbiAgICByZW5kZXJBbGxQbGF5ZXJzKG5ld1BsYXllcnMpO1xuICAgIHJldHVybiAocGxheWVyRGF0YSA9IHtcbiAgICAgIG5hbWU6IChmb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUgPSBcIlwiKSxcbiAgICAgIGJyZWVkOiAoZm9ybS5lbGVtZW50cy5icmVlZC52YWx1ZSA9IFwiXCIpLFxuICAgIH0pO1xuICB9KTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGZldGNoQWxsUGxheWVycyB9IGZyb20gXCIuL2FqYXhIZWxwZXJzXCI7XG5pbXBvcnQgeyByZW5kZXJBbGxQbGF5ZXJzLCByZW5kZXJOZXdQbGF5ZXJGb3JtIH0gZnJvbSBcIi4vcmVuZGVySGVscGVyc1wiO1xuXG5jb25zdCBpbml0ID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCBwbGF5ZXJzID0gYXdhaXQgZmV0Y2hBbGxQbGF5ZXJzKCk7XG4gIHJlbmRlckFsbFBsYXllcnMocGxheWVycyk7XG4gIHJlbmRlck5ld1BsYXllckZvcm0oKTtcbn07XG5cbmluaXQoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=