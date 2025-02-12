import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./Home.css";
import Personal from "../../components/Personal";
import Create from "../../components/Create";
import MyVaults from "../../components/MyVaults";
import Challenges from "../../components/Challenges";
import ExpenseTable from "../../components/ExpenseTable";
function Home() {
  const componentMap = {
    Personal: Personal,
    MyVaults: MyVaults,
    Create: Create,
    Challenges: Challenges,
    Expenses: ExpenseTable
  };

  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Personal");
  const SelectedComponent =
    componentMap[selectedItem] || (() => <h1>Page Not Found</h1>);

  const handleDrawerOpen = () => setOpen(!open);
  const handleSidebarItemClick = (item) => {
    console.log("Home component - handleSidebarItemClick called with:", item);
    setSelectedItem(item);
  };

  return (
    <>
      <Header handleDrawerOpen={handleDrawerOpen} />
      <div className="main-layout">
        <Sidebar open={open} onSelectItem={handleSidebarItemClick} />
        <div className="content-container">
          <div className="topBlur"></div>
          <div className="bottomBlur"></div>
          <main className="main-content">
            {/* <h1>Selected: {selectedItem}</h1> */}
            <SelectedComponent />
          </main>
        </div>
      </div>
    </>
  );
}

export default Home;
