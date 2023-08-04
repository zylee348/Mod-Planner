import { useState, useEffect } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import StatsRingCard from "./StatsRingCard";
import GpaCalculator from "./GpaCalculator";
import { db, database, app as firebase } from "../../database/firebase";
// import {collection, doc, getDoc,} from "firebase/firestore";
import {ref, child, get, set, remove, onValue } from "firebase/database";
import {collection, getDocs, setDoc, doc } from "firebase/firestore";
import {getAuth, onAuthStateChanged } from "firebase/auth";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "initial",
    minHeight: "100vh",
  },
}));

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }
      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

var initialData = [
  {
    moduleCode: "CS1010",
    MCs: 4,
  },
  {
    moduleCode: "MA2001",
    MCs: 5,
  },
];

function Home() {
  const [moduleData, setModuleData] = useState([...initialData]);
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState([...initialData]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);
  
  // Fetch stored moduleData from Firestore when the user is logged in
  useEffect(() => {
    const fetchStoredModuleData = async () => {
      try {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userId = user.uid;
            const querySnapshot = await getDocs(
              collection(db, "users", userId, "moduleData")
            );
            const userModuleData = querySnapshot.docs.map((doc) => doc.data());
            setModuleData(userModuleData);
          }
        });
      } catch (error) {
        console.error("Error fetching user's module data:", error);
      }
    };

    fetchStoredModuleData();
  }, []);

  useEffect(() => {
    const storeModuleDataInFirestore = async () => {
      if (currentUser) {
        const userId = currentUser.uid;
        console.log(userId);
        const userDocRef = doc(db, "users", userId);

        try {
          await setDoc(userDocRef, { moduleData }, { merge: true });
          console.log("Successfully stored moduleData in Firestore");
        } catch (error) {
          console.error("Error storing moduleData in Firestore:", error);
        }
      }
    };

    storeModuleDataInFirestore();
  }, [currentUser, moduleData]);

  const getCurrentUser = () => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      }, (error) => {
        reject(error);
      });
    });
  };

  const fetchModule = async () => {
    try {
      const moduleRef = ref(database, `${userInput}`);
      const moduleSnapshot = await get(moduleRef);
  
      if (moduleSnapshot.exists()) {
        const moduleData = moduleSnapshot.val();
        if (typeof moduleData === 'undefined') {
          console.log("Failed");
          setError("Invalid module code entered. Please try again");
        } else {
          const module = {
            moduleCode: userInput,
            MCs: moduleData.moduleCredit,
          };
          setModuleData((prevModuleData) => [...prevModuleData, module]);
          // Store the updated moduleData in Firestore
          // if (currentUser) {
          //   const userId = currentUser.uid;
          //   const userDocRef = doc(db, "users", userId);
          //   await setDoc(userDocRef, (prevDoc) => {
          //     const updatedModuleData = prevDoc.get("moduleData") || [];
          //     return { moduleData: [...updatedModuleData, module] };
          //   }, { merge: true });
          // }
          setUserInput("");
        }
      } else {
        console.log("Failed");
        setError("Invalid module code entered. Please try again");
      }
    } catch (error) {
      console.error("Unable to fetch modules from db", error);
    }
  };

  const calculateTotalMCs = (data) => {
    // Calculate the total MCs from all modules in 'data' array
    return data.reduce((total, module) => total + module.MCs, 0);
  };

  const totalMCs = calculateTotalMCs(moduleData);
  
  // // Replacing root of each realtime DB doc with moduleCode
  // const changeRootKeyName = async (database, oldKeyName) => {
  //   try {
  //     // Step 1: Read the data from the old key
  //     const oldKeyRef = ref(database, oldKeyName);
  //     const oldKeySnapshot = await get(oldKeyRef);
  
  //     if (oldKeySnapshot.exists()) {
  //       // Step 2: Create a new key and set its value to the data from the old key
  //       const moduleCodeValue = oldKeySnapshot.child('moduleCode').val();
  //       const newKeyName = moduleCodeValue;
  //       const newKeyRef = ref(database, newKeyName);
  //       await set(newKeyRef, oldKeySnapshot.val());
  
  //       // Step 3: Remove the old key
  //       await remove(oldKeyRef);
  
  //       console.log(`Successfully changed the root key name from "${oldKeyName}" to "${newKeyName}"`);
  //     } else {
  //       console.log(`Key "${oldKeyName}" does not exist in the database.`);
  //     }
  //   } catch (error) {
  //     console.error("Error changing the root key name:", error);
  //   }
  // };

  // useEffect(() => {
  //   const updateRootKeys = async () => {
  //     for (let i = 0; i < 15260; i++) {
  //       await changeRootKeyName(database, i);
  //     }
  //   };
  
  //   updateRootKeys();
  // }, []);

  // useEffect(() => {
  //   fetchModule();
  // }, [userInput]);

  useEffect(() => {
    setSortedData(sortData(moduleData, { sortBy, reversed: reverseSortDirection, search }));
  }, [moduleData, sortBy, reverseSortDirection, search]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    fetchModule();
  };

  function ErrorPopup({ errorMessage, onClose }) {
    return (
      <div className="error-popup">
        <p>{errorMessage}</p>
        <button onClick={onClose}>Dismiss</button>
      </div>
    );
  }

  const dismissError = () => {
    setError(null);
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const { classes } = useStyles();

  const rows = sortedData.map((row) => (
    <tr key={row.moduleCode}>
      <td>{row.moduleCode}</td>
      <td>{row.MCs}</td>
    </tr>
  ));

  return (
    <ScrollArea>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={userInput} onChange={handleInputChange} />
          <button type="submit">Add module</button>
        </form>
        {error && <ErrorPopup errorMessage={error} onClose={dismissError} />}
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          sx={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "moduleCode"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("moduleCode")}
              >
                Module Code
              </Th>
              <Th
                sorted={sortBy === "MCs"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("MCs")}
              >
                MCs
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan="2">
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div>
          <Text align="center" color="gray" size="xs">
            Number of modules in record: {moduleData.length}
          </Text>
        </div>
      </div>

      <div>
        <StatsRingCard
          title="Your statistics"
          completed={moduleData.length}
          total={160}
        />
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <GpaCalculator />
      </div>
    </ScrollArea>
  );
}

export default Home;