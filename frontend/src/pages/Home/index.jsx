import { useState, useEffect } from "react";
import api from "../../api";
import Vault from "../../components/Vault";
import "./Home.css"
import Header from "../../components/Header";

function Home() {
    const [vault, setVault] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [target_amount, setTargetAmount] = useState(0);
    const [current_amount, setCurrentAmount] = useState(0);

    useEffect(() => {
        getVaults();
    }, []);

    const getVaults = () => {
        api
            .get("/api/vault/")
            .then((res) => res.data)
            .then((data) => {
                console.log(data);  // Log data to check if 'id' is included
                setVault(data);
            })
            .catch((err) => alert(err));
    };
    

    const deleteVault = (id) => {
        api.delete(`/api/vault/delete/${id}/`).then((res) => {
            if (res.status === 204) alert("Vault deleted!")
            else alert("Failed to delete the vault!")
            getVaults();
        })
            .catch((error) => alert(error));
        
    };

    const createVault = (e) => {
        e.preventDefault();
        api.post("/api/vault/", { description, title, target_amount, current_amount })
            .then((res) => {
                if (res.status === 201) {
                    alert("Vault is created!");
                    setTitle("");
                    setDescription("");
                    setTargetAmount(0);
                    setCurrentAmount(0);
                    getVaults(); // Fetch the updated list only after creation is successful
                } else {
                    alert("Failed to create a vault!");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("An error occurred while creating the vault.");
            });
    };
    
    

    return (
        <>
            <Header />
            <div>
                <h2>Vaults</h2>
                {/* Displaying all the vaults */}
                {vault.map((vault) => (
                    <Vault vault={vault} onDelete={deleteVault} key={vault.id} />
                ))}

                <form onSubmit={createVault}>
                    <label htmlFor="title">Title: </label>
                    <br />
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <br />

                    <label htmlFor="description">Tell us about your goal here: </label>
                    <br />
                    <textarea
                        id="description"
                        name="description"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <br />

                    <label htmlFor="target_amount">Target amount: </label>
                    <br />
                    <input
                        type="number"
                        id="target_amount"
                        name="target_amount"
                        required
                        onChange={(e) => setTargetAmount(e.target.value)}
                        value={target_amount}
                    />
                    <br />

                    <label htmlFor="current_amount">Current amount: </label>
                    <br />
                    <input
                        type="number"
                        id="current_amount"
                        name="current_amount"
                        required
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        value={current_amount}
                    />
                    <br />

                    <input type="submit" value="Submit" />
                </form>
            </div>
        </>
    );
}
export default Home;