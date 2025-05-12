'use client'
import { useEffect, useState } from 'react'
import "../../styles/globals.css";

export default function Home() {
    const [blz, setBlz] = useState('');
    const [name, setName] = useState('');
    const [urlPath, setUrlPath] = useState('');
    const [banks, setBanks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);  // Zustand für Bearbeiten/Erstellen
    const [isModalOpen, setIsModalOpen] = useState(false); // Zustand für das Modal

    useEffect(() => {
        fetchBanks();
        setIsModalOpen(false);  // Modal beim Seiten-Reload schließen
    }, []);

    const fetchBanks = async () => {
        const response = await fetch('/api/blz/show');
        const data = await response.json();
        setBanks(data);
    };

    const handleSave = async () => {
        const response = await fetch('/api/blz/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blz, name, urlPath }),
        });
        const data = await response.json();
        console.log('Bank gespeichert:', data);
        fetchBanks();
        closeModal();  // Modal schließen nach dem Speichern
    };

    const handleDelete = async (blz) => {
        const response = await fetch('/api/blz/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blz }),
        });
        const data = await response.json();
        console.log('Bank gelöscht:', data);
        fetchBanks();
    };

    const handleEdit = (bank) => {
        setBlz(bank.blz);
        setName(bank.name);
        setUrlPath(bank.urlPath);
        setIsEditing(true);
        openModal();  // Modal öffnen im Bearbeitungsmodus
    };

    const handleNew = () => {
        setBlz('');
        setName('');
        setUrlPath('');
        setIsEditing(false);  // Modus für neue Bank
        openModal();
    };

    const openModal = () => {
        setIsModalOpen(true);  // Modal öffnen
    };

    const closeModal = () => {
        setIsModalOpen(false);  // Modal schließen
    };

    return (
        <div>
            <button className="button save" onClick={handleNew}>Neue Bank hinzufügen</button>

            <table>
                <thead>
                    <tr>
                        <th>BLZ</th>
                        <th>Name</th>
                        <th>URL-Pfad</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {banks.map(bank => (
                        <tr key={bank.blz}>
                            <td>{bank.blz}</td>
                            <td>{bank.name}</td>
                            <td>{bank.urlPath}</td>
                            <td>
                                <button onClick={() => handleEdit(bank)} className="button">Bearbeiten</button>
                                <button onClick={() => handleDelete(bank.blz)} className="button delete">Löschen</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal für Bearbeiten/Erstellen */}
            {isModalOpen && (
                <div id="modal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{isEditing ? "Bank bearbeiten" : "Neue Bank hinzufügen"}</h2>
                        <form>
                            <input 
                                type="text" 
                                value={blz} 
                                onChange={(e) => setBlz(e.target.value)} 
                                placeholder="BLZ" 
                            />
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Name" 
                            />
                            <input 
                                type="text" 
                                value={urlPath} 
                                onChange={(e) => setUrlPath(e.target.value)} 
                                placeholder="URL-Pfad" 
                            />
                        </form>
                        <div className="modal-buttons">
                            <button onClick={handleSave} className="button save">{isEditing ? "Änderungen speichern" : "Speichern"}</button>
                            <button onClick={closeModal} className="button cancel">Abbrechen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
