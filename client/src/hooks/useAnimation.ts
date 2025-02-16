import { useCallback, useState } from "react";

export const useAnimateDialog = (startDialog: string) => {
  const [dialog, setDialog] = useState(startDialog);

  const animateDialog = useCallback((by: string, text: string) => {
    return new Promise<void>((resolve) => {
      setDialog("");

      const startAnimation = () => {
        const interval = setInterval(() => {
          setDialog((prev) => {
            if (prev === text) {
              clearInterval(interval);
              resolve();
              return text;
            }
            return text.slice(0, prev.length + 1);
          });
        }, 30);
      };

      if (by === "DEFENDER") {
        setTimeout(startAnimation, 1000);
      } else {
        startAnimation();
      }
    });
  }, []);

  return { dialog, animateDialog };
};

export const useAnimateHp = (initialHp: number) => {
  const [displayHp, setDisplayHp] = useState(initialHp);

  const animateHpDecrease = useCallback((targetHp: number) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setDisplayHp((prev) => {
          if (prev <= targetHp) {
            clearInterval(interval);
            resolve();
            return targetHp;
          }
          return prev - 1;
        });
      }, 50);
    });
  }, []);

  return { displayHp, animateHpDecrease, setDisplayHp };
};
