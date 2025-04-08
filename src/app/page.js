'use client'

import FuturisticVogueAI from "@/components/activate-ai/ActivateAi";
import HomeScreen from "@/components/home-screen/HomeScreen";
import LocationShare from "@/components/location-share/LocationShare";
import ProfileForm from "@/components/user-detail/UserDetail";
import { useEffect, useState } from "react";

export default function Home() {
  const [steps, setSteps] = useState(2); // Define steps state

  useEffect(() => {
    // const userLocationData = sessionStorage.getItem("userLocationData");
    // const userProfileData = localStorage.getItem('userProfileData');
    // if (userLocationData) {
    //   setSteps(1);
    // }
    // if (userProfileData && userLocationData) {
    //   setSteps(2);
    // }
  }, []);

  return (
    <div>
      {steps === 0 && <LocationShare />}
      {steps === 1 && <ProfileForm />}
      {/* {steps=== 2 && <FuturisticVogueAI/>} */}
      {steps === 2 &&
        <div>
          <HomeScreen />
        </div>
      }
    </div>
  );
}
