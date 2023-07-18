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
import { db } from "../../database/firebase";
import {collection, doc, getDoc,} from "firebase/firestore";

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

  const fetchModule = async () => {
    try {
      const docRef = doc(db, 'modules', userInput);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        if (typeof docSnap.data() === 'undefined') {
          console.log("Failed");
          setError("Invalid module code entered. Please try again");
        }
        const module = {
          moduleCode: docSnap.id,
          MCs: docSnap.data().moduleCredit,
        };
        setModuleData((prevModuleData) => [...prevModuleData, module]);
        setUserInput("");
      } else {
        console.log("Failed");
        setError("Invalid module code entered. Please try again");
      }
    } catch (error) {
      console.error("Unable to fetch modules from db", error);
    }
  };

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
          completed={80}
          total={160}
          stats={[
            { value: 30, label: "Sem 1" },
            { value: 30, label: "Sem 2" },
            { value: 20, label: "Sem 3" },
          ]}
        />
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <GpaCalculator />
      </div>
    </ScrollArea>
  );
}

export default Home;