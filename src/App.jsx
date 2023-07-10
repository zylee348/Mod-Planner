import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.nusmods.com/v2/2023-2024/moduleInfo.json"
        );
        const modules = await response.json();
    
        modules.forEach(async (module) => {
          const { moduleCode, moduleCredit } = module;
          try {
            await setDoc(doc(db, "modules", moduleCode), { moduleCredit });
            console.log(`Module ${moduleCode} stored in Firestore.`);
          } catch (error) {
            console.error(`Error storing module ${moduleCode} in Firestore:`, error);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Main Page</h1>;
    </>
  );
}

export default App;
