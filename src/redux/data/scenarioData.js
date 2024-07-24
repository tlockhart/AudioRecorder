import sunburn1 from "../../assets/images/sunburn-back.png";
import sunburn2 from "../../assets/images/sunburn-shades.png";
import sunburn3 from "../../assets/images/sunburn-hat.png";
import sunburn4 from "../../assets/images/sunburn-beach.png";
import sunburn5 from "../../assets/images/sunburn-umbrella.png";
import sunburn6 from "../../assets/images/sunburn-sunscreen.png";

import backpain1 from "../../assets/images/backpain-pickup.png";
import backpain2 from "../../assets/images/backpain-carry.png";
import backpain3 from "../../assets/images/backpain-stretch.png";
import backpain4 from "../../assets/images/backpain-heels.png";
import backpain5 from "../../assets/images/backpain-sit.png";

import newdesk1 from "../../assets/images/newdesk-full.png";
import newdesk2 from "../../assets/images/newdesk-corner.png";
import newdesk3 from "../../assets/images/newdesk-books.png";
import newdesk4 from "../../assets/images/newdesk-computer.png";
import newdesk5 from "../../assets/images/newdesk-standing.png";

import soap1 from "../../assets/images/soap-delivery.png";
import soap2 from "../../assets/images/soap-melted.png";
import soap3 from "../../assets/images/soap-cost.png";
import soap4 from "../../assets/images/soap-lavender.png";
import soap5 from "../../assets/images/soap-cracked.png";
import soap6 from "../../assets/images/soap-orange.png";

import trip1 from "../../assets/images/trip-hotspring.png";
import trip2 from "../../assets/images/trip-canoe.png";
import trip3 from "../../assets/images/trip-steam.png";
import trip4 from "../../assets/images/trip-hike.png";
import trip5 from "../../assets/images/trip-waterfall.png";

import displaySvgIcon from "../../utils/displaySvgIcon";

const scenarioData = {
  global: {
    svgs: {
      microphone: {
        inactive: displaySvgIcon("mic0"),
        active: [displaySvgIcon("mic1"), displaySvgIcon("mic2")],
      },
    },
  },
  passageTranslation: {
    type: "passageTranslation",
    intructions: {
      title: "Speak from pictures",
      details:
        "You will be given a scenario and shown some images. You’ll then have 90 seconds to speak, using the images provided to respond to the scenario. ",
    },
    scenarios: [
      {
        meta: "sunburn",
        title: "Instructions",
        details:
          "Your friend recently got a sunburn after spending a day at the beach. She is asking you about the ways to protect herself from the sun. Give her some suggestions based on the pictures provided. You have 90 seconds to speak.",
        image: [sunburn1, sunburn2, sunburn3, sunburn4, sunburn5, sunburn6],
      },
      {
        meta: "backpain",
        title: "Instructions",
        details:
          "Your friend often has back pain. She is asking you about the ways to prevent it. Tell her what to do and what not to do based on the pictures provided. You have 90 seconds to speak.",
        image: [backpain1, backpain2, backpain3, backpain4, backpain5],
      },
      {
        meta: "newdesk",
        title: "Instructions",
        details:
          "You recently got a new office desk and have been using it for about a month. Your co-worker is also interested in getting the same desk and wondering about your experience with it. Please tell him what you like and don’t like about the desk based on the pictures provided. You have 90 seconds to speak. ",
        image: [newdesk1, newdesk2, newdesk3, newdesk4, newdesk5],
      },
      {
        meta: "soap",
        title: "Instructions",
        details:
          "You recently purchased a hand soap that is very popular these days. Your friend is also interested in getting the same soap and wondering about your experience with it. Please tell her what you liked and didn’t like about it based on the pictures provided. You have 90 seconds to speak.",
        image: [soap1, soap2, soap3, soap4, soap5, soap6],
      },
      {
        meta: "trip",
        title: "Instructions",
        details:
          "You recently had a trip to Yellowstone National Park. On the way to your class, you bumped into your classmate, and she is asking about your experience there. Tell her what you did based on the pictures provided. You have 90 seconds to speak.",
        image: [trip1, trip2, trip3, trip4, trip5],
      },
    ],
  },
  advice: {
    scenarios: {},
  },
  chat: {
    scenarios: {},
  },
  opinion: {
    scenarios: {},
  },
  currentState: {
    type: "passageTranslation",
    scenario: "",
    step: 0,
  },
};

export default scenarioData;
