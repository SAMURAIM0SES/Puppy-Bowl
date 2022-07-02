// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2206-FTB-ET-WEB-FT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


export const fetchAllPlayers = async () => {
    try {
      const response = await fetch(`${APIURL}/players`);
      const result = await response.json();
      if (result.error) throw result.error;
      return result.data.players;
    } catch (err) {
      console.error('Uh oh, trouble fetching players!', err);
    }
  }


export const fetchSinglePlayer = async (playerId) => {
    try {
        const singleResponse = await fetch(`${APIURL}players/playerId`);
        const singleResult = await singleResponse.json();
        if (singleResult.error) throw singleResult.error;
        return singleResult.data.playerId;
      } catch (err) {
        console.error('Uh oh, trouble fetching playerId!', err);
      }
    }

export const addNewPlayer = async (playerObj) => {

};

export const removePlayer = async (playerId) => {

};
