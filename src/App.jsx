import { useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, Group, Avatar, Text, rem } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export function TableSelection({ data }) {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
            transitionDuration={0}
          />
        </td>
        <td>
          <Group spacing="sm">
            <Avatar size={26} src={item.avatar} radius={26} />
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
          </Group>
        </td>
        <td>{item.email}</td>
        <td>{item.job}</td>
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <thead>
          <tr>
            <th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={selection.length > 0 && selection.length !== data.length}
                transitionDuration={0}
              />
            </th>
            <th>User</th>
            <th>Email</th>
            <th>Job</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}


// // import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import "./addTask.css";
// import React, { useEffect, useState } from "react";
// import { db, database } from "./firebase";
// // import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { ref, set } from 'firebase/database';


// function App() {
//   const [count, setCount] = useState(0);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "https://api.nusmods.com/v2/2023-2024/moduleInfo.json"
//         );
//         const modules = await response.json();
//         const firstModuleCode = modules[0].moduleCode;
//         setData(firstModuleCode);

//         modules.forEach(async (module) => {
//           const moduleRef = ref(database, 'modules', module.moduleCode);
//           await set(moduleRef, module);
//         });
//         // const databaseRef = ref(database);
//         // set(databaseRef, modules);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // /* function to add new task to firestore */
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     await addDoc(collection(db, "modules"), data);
//   //     // await addDoc(collection(db, "modules"), {
//   //     //   title: "Your title",
//   //     //   description: "Your description",
//   //     //   // title: title,
//   //     //   // description: description,
//   //     //   completed: false,
//   //     //   created: Timestamp.now(),
//   //     // });
//   //     // onClose();
//   //   } catch (err) {
//   //     alert(err);
//   //   }
//   // };

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <div>{data}</div>
//       {/* <button onClick={handleSubmit}>Add to Collection</button> */}
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   );
// }

// export default App;
