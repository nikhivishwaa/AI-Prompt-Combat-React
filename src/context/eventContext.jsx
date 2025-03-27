import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const EventContext = createContext();

export const EventContextProvider = ({ children }) => {
  const [participant, setParticipant] = useState({});
  const [challenge, setChallenge] = useState({});
  const [round1, setRound1] = useState([]);
  const [round2, setRound2] = useState([]);
  const [allowRound1, setAllowRound1] = useState(true);

  const initiateEvent = async () => {
    try {
      const challengeCache = JSON.parse(
        secureLocalStorage.getItem("activeChallenge")
      );
      if (!challengeCache) return;
      setChallenge(challengeCache);
      const participantCache = JSON.parse(
        secureLocalStorage.getItem("participant")
      );
      if (!participantCache) return;
      setParticipant(participantCache);
      const round1Cache = JSON.parse(secureLocalStorage.getItem("round1"));
      if (!round1Cache) return;
      setRound1(round1Cache);
      const allowRound1Cache = JSON.parse(secureLocalStorage.getItem("allowRound1"));
      if (!allowRound1Cache) return;
      setAllowRound1(allowRound1Cache);
      const round2Cache = JSON.parse(secureLocalStorage.getItem("round2"));
      if (!round2Cache) return;
      setRound2(round2Cache);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    initiateEvent();
  }, []);

  return (
    <EventContext.Provider
      value={{
        participant,
        setParticipant,
        challenge,
        setChallenge,
        round1,
        setRound1,
        round2,
        setRound2,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const EventProvider = () => useContext(EventContext);
