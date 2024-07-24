import { createSlice } from "@reduxjs/toolkit";
import {
  getScenarioReducer,
} from "../reducers/scenarioReducer";

// import navbarData from "../data/navbarData";
import scenarioData from "../data/scenarioData";

/********************************
 * Configure Slice with reducers
 * and Export actions and reducer
 *******************************/
const scenarioSlice = createSlice({
  name: "app",
  initialState: scenarioData,
  reducers: {
    getScenario: getScenarioReducer,
    // setUser: setScenarioReducer,
    // setUserDisciplines: updateScenarioReducer,
  },
});

// Note: scenarioSlice.actions automatically creates actions based on our reducer names
export const { 
  getScenario, 
  // setUser, 
  // setUserDisciplines 
} = scenarioSlice.actions;

// export  reducer, so it can be added to the store
export default scenarioSlice.reducer;
