import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Battery from "../../components/shared/Battery";
import { Icon, Image } from "../../utils/general";
import "./back.scss";

export { Background } from "./Background";
export { BootScreen } from "./Background";
export { LockScreen } from "./Background";

export const LockScreen = (props) => {
  const dispatch = useDispatch();

  const [lock, setLock] = useState(false);
  const [unlocked, setUnLock] = useState(false);
  const [pin, setPin] = useState("");
  const [forgot, setForget] = useState(false);
  const [error, setError] = useState(false);

  const userName = useSelector((state) => state.setting.person.name);
  const savedPIN = useSelector((state) => state.setting.person.pin);

  // handle clicks using data-action
  const action = (e) => {
    const act = e.target.dataset.action;

    if (act === "splash") setLock(true);
    if (act === "forgot") setForget(true);
    if (act === "input") {
      let val = e.target.value.slice(0, 4); // max 4 digits
      setPin(val);
    }
  };

  const proceed = () => {
    if (pin !== savedPIN) {
      // ❌ Wrong PIN → shake effect
      setError(true);
      setTimeout(() => setError(false), 500);
      return;
    }

    // ✔ Correct PIN → unlock animation
    setUnLock(true);
    setTimeout(() => dispatch({ type: "WALLUNLOCK" }), 1000);
  };

  const keyEnter = (e) => (e.key === "Enter" ? proceed() : null);

  return (
    <div
      className={"lockscreen " + (props.dir === -1 ? "slowfadein" : "")}
      data-unlock={unlocked}
      style={{ backgroundImage: `url(img/wallpaper/lock.jpg)` }}
      onClick={action}
      data-action="splash"
      data-blur={lock}
    >
      {/* Splash Clock */}
      <div className="splashScreen mt-40" data-faded={lock}>
        <div className="text-6xl font-semibold text-gray-100">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          })}
        </div>
        <div className="text-lg font-medium text-gray-200">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Unlock Panel */}
      <div className="fadeinScreen" data-faded={!lock} data-unlock={unlocked}>
        <Image
          className="rounded-full overflow-hidden"
          src="img/asset/prof.jpg"
          w={170}
          ext
        />

        <div className="mt-4 text-2xl font-medium text-gray-200">
          {userName}
        </div>

        {/* PIN Input */}
        <div className={`pinBox ${error ? "shake" : ""}`}>
          <input
            type="password"
            className="pinInput"
            placeholder="Enter PIN"
            maxLength={4}
            value={pin}
            data-action="input"
            onChange={action}
            onKeyDown={keyEnter}
          />
          <Icon
            className="arrowIcon"
            fafa="faArrowRight"
            width={16}
            color="rgba(200, 200, 200, 0.7)"
            onClick={proceed}
          />
        </div>

        {/* Forgot PIN */}
        <div
          className="text-xs text-gray-400 mt-4 handcr"
          data-action="forgot"
          onClick={action}
        >
          {!forgot ? "I forgot my PIN" : "Not my problem"}
        </div>
      </div>

      {/* Bottom system info */}
      <div className="bottomInfo flex">
        <Icon className="mx-2" src="wifi" ui width={16} invert />
        <Battery invert />
      </div>
    </div>
  );
};
