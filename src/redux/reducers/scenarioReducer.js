import React from "react";

export const getScenarioReducer = (state, action) => {
  return state; // Assuming 'user' is the key for user state in Redux store
};

// export const setUserReducer = (state, action) => {
//   // console.log("State1:", JSON.stringify(state), "Payload:", action.payload);

//   const updatedUser = action.payload;
//   const nextState = { ...state };

//   // Update other properties if they are defined in updatedUser
//   const keys = Object.keys(updatedUser);
//   console.log("Keys:", keys);
//   keys.forEach((key) => {
//     // Update schoolDepartment property directly
//     if (keys.length === 1 && updatedUser.hasOwnProperty("schoolDepartment")) {
//       console.log("Key1:", updatedUser[key])
//       nextState.schoolDepartment = updatedUser.schoolDepartment;
//     } 
//     else  if (keys.length === 1 && updatedUser.hasOwnProperty("packagePrice")) {
//       console.log("Key2:", updatedUser[key])
//       nextState.packagePrice = updatedUser.packagePrice;
//     }
//     else if (key && (updatedUser[key] !== undefined && updatedUser[key] !== null) ) {
//       console.log("Key3:", updatedUser[key])
//       nextState[key] = updatedUser[key];
//     }
//   });

//   return nextState;
// };

// export const updateUserDisciplinesReducer = (state, action) => {
//   const { disciplines } = action.payload;

//   // Assuming 'user' is the key for user state in Redux store
//   return {
//     ...state,
//     schoolDisciplines: disciplines,
//   };
// };
