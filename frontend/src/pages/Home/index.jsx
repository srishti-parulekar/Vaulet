import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./Home.css";
import Personal from "../../components/Personal";
import Create from "../../components/Create";
import MyVaults from "../../components/MyVaults";
import Challenges from "../../components/Challenges";
import ExpenseTable from "../../components/ExpenseTable";
import StatsDashboard from "../../components/StatsDashboard";
import Chat from "../../components/Chat";
function Home() {
  const componentMap = {
    Personal: Personal,
    MyVaults: MyVaults,
    Create: Create,
    Challenges: Challenges,
    Expenses: ExpenseTable,
    StatsDashboard: StatsDashboard,
    Vaulter: Chat,
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
    <div className="flex h-screen overflow-hidden bg-black">
      <Header handleDrawerOpen={() => setOpen(!open)} />
      <div className="flex flex-1 pt-16"> {/* Added pt-16 to account for fixed header */}
        <Sidebar open={open} onSelectItem={setSelectedItem} />
        <div 
          className="flex-1 relative transition-all duration-300 ease-in-out"
          style={{
            marginLeft: open ? "250px" : "0px"
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-900/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/30 to-transparent pointer-events-none" />
          
          <main className="h-[calc(100vh-64px)] mt-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="p-6">
              <SelectedComponent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
